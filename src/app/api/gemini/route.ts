import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fromData = await req.formData();
    // console.log("fromData", fromData);
    const image = fromData.get("image") as File;
    const restaurantId = fromData.get("restaurantId") as string;

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

    //check if maximum extraction limit exists
    const { data, error } = await supabase
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

    if (error || !data || !data.plan) {
      console.error("Error fetching user extraction info:", error?.message);
      return null;
    }

    // Handle plan safely (array or object)
    const plan = Array.isArray(data.plan) ? data.plan[0] : data.plan;

    if (!plan) {
      console.error("No plan found for user");
      return null;
    }

    const used = data.menu_extracted;
    const available = Math.max(plan.menu_extraction_limit - used, 0);

    if (available <= 0) {
      return NextResponse.json(
        { error: "Extraction limit reached" },
        { status: 403 },
      );
    }

    // 3️⃣ Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4️⃣ Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.CREATE_ORDER,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const ApiKey = process.env.GEMINI_API_KEY;

    if (!ApiKey) {
      return NextResponse.json({ error: "No API key found" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(ApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert menu data extractor.

From the image I am uploading, extract structured menu data in the following JSON format:

{
  id: "cat-<slugified-category-name>",
  name: "<Category Name>",
  slug: "<slugified-category-name>",
  description: "<Brief description of the category>",
  products: [
    {
      id: "prod-<slugified-product-name>",
      name: "<Product Name>",
      slug: "<slugified-product-name>",
      description: "<Brief description of the product>",
      price: <price>,
      currency: "NPR",
      image: {
        url: "/images/coffee.png",
        alt: "<Product Name> in a cup"
      },
      available: true
    }
  ]
}

Only return the JSON array. Assume currency is NPR. Use placeholder image "/images/coffee.png". Slugify names. Return valid JSON only.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      },
    ]);

    let raw = await result.response.text();

    if (raw.startsWith("```")) {
      raw = raw.replace(/```(?:json)?\n?/, "").replace(/```$/, "");
    }

    try {
      const data = JSON.parse(raw);
      return NextResponse.json({ data }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Gemini response", raw: raw },
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
