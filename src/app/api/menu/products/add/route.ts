import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { name, price, description, category_id } = await req.json();

  console.log(
    "from route ",
    "name",
    name,
    "price",
    price,
    "description",
    description,
    "category_id",
    category_id
  );

  if (!name || !price || !description || !category_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: name,
        description: description,
        price: price,
        category_id: category_id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { data, message: "Product added successfully", success: true },
    { status: 200 }
  );
}
