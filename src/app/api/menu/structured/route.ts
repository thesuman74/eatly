// src/pages/api/menu/structured.ts
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const structured = await getCategoriesFromDB();
    return NextResponse.json(structured, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
