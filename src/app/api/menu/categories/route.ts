import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/menu/categories
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const body = await req.json();

  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data, error } = await (await supabase)
    .from("categories")
    .insert([{ name }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
