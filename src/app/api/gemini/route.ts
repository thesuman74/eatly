import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const restaurantId = formData.get("restaurantId") as string;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required restaurantId" },
        { status: 400 },
      );
    }

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Check user's extraction limit
    const { data: userPlanData, error: planError } = await supabase
      .from("users")
      .select(
        `
        menu_extracted,
        plan (
          menu_extraction_limit
        )
      `,
      )
      .eq("id", user.id)
      .single();

    if (planError || !userPlanData || !userPlanData.plan) {
      console.error("Error fetching user plan data:", planError?.message);
      return NextResponse.json(
        { error: "Unable to fetch user plan information" },
        { status: 500 },
      );
    }

    const plan = Array.isArray(userPlanData.plan)
      ? userPlanData.plan[0]
      : userPlanData.plan;
    const used = userPlanData.menu_extracted;
    const available = Math.max(plan.menu_extraction_limit - used, 0);

    if (available <= 0) {
      return NextResponse.json(
        { error: "Menu extraction limit reached" },
        { status: 403 },
      );
    }

    // 3️⃣ Fetch user role and restaurant assignment
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userDataError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4️⃣ Permission check
    if (!can({ role: userData.role, permission: Permission.EXTRACT_MENU })) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // 5️⃣ Prepare image for Gemini API
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key found" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert menu data extractor.

From the image I am uploading, extract structured menu data in the following JSON format:

{
  id: "cat-<slugified-category-name>",
  name: "<Category Name>",
  slug: "<slugified-category-name>",
  description: "<Generate brief description of the category>",
  products: [
    {
      id: "prod-<slugified-product-name>",
      name: "<Product Name>",
      slug: "<slugified-product-name>",
      description: "<Generate brief description of the product>",
      price: <price>,
      currency: "NPR",
      image: {
        url: "/images/coffee.png",
        alt: "<Product Name> Image"
      },
      available: true
    }
  ]
}

Only return the JSON array. Assume currency is NPR. Use placeholder image "/images/coffee.png". Slugify names. Return valid JSON only.
`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: image.type, data: base64Image } },
    ]);

    let rawResponse = await result.response.text();

    if (rawResponse.startsWith("```")) {
      rawResponse = rawResponse
        .replace(/```(?:json)?\n?/, "")
        .replace(/```$/, "");
    }

    // 6️⃣ Parse Gemini response
    try {
      const data = JSON.parse(rawResponse);

      // 7️⃣ Increment user's menu_extracted count
      const { error: updateError } = await supabase
        .from("users")
        .update({ menu_extracted: used + 1 })
        .eq("id", user.id);

      if (updateError) {
        console.error(
          "Failed to increment menu_extracted:",
          updateError.message,
        );
        return NextResponse.json(
          {
            error: updateError.message || "Failed to increment menu_extracted",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ data }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Gemini response", raw: rawResponse },
        { status: 500 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err.message },
      { status: 500 },
    );
  }
}
