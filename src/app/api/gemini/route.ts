import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fromData = await req.formData();
    const image = fromData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

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

    const text = await result.response.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json({ data }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Gemini response", raw: text },
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
