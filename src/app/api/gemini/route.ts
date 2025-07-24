import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fromData = await req.formData();
    console.log("fromData", fromData);
    const image = fromData.get("image") as File;
    console.log("image", image);

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const ApiKey = process.env.GEMINI_API_KEY;
    console.log("ApiKey", ApiKey);

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
      price: <price in cents>,
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

    // Remove markdown code block if present
    if (raw.startsWith("```")) {
      raw = raw.replace(/```(?:json)?\n?/, "").replace(/```$/, "");
    }

    try {
      const data = JSON.parse(raw);
      console.log("Data from gemini", data);
      return NextResponse.json({ data }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Gemini response", raw: raw },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err.message },
      { status: 500 }
    );
  }
}
