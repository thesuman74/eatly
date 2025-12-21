import { NextResponse } from "next/server";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";

export async function GET(req: Request) {
  try {
    // console.log("structured api req", req);
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    console.log("restaurantId from routes", restaurantId);

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    const structured = await getCategoriesFromDB(restaurantId);
    return NextResponse.json(structured);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
