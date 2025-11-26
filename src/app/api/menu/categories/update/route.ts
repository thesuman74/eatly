// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// export async function PATCH(req: Request) {
//   try {
//     const supabase = await createClient();

//     const { categoryId, categoryName, position } = await req.json();

//     if (!categoryId || !categoryName || !position) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const updateData: {
//       name?: string;
//       position?: number;
//     } = {};
//     if (categoryName !== undefined) {
//       updateData.name = categoryName;
//     }
//     if (position !== undefined) {
//       updateData.position = position;
//     }

//     const { data, error } = await supabase
//       .from("categories")
//       .update(updateData)
//       .eq("id", categoryId)
//       .select()
//       .single();

//     if (error) {
//       console.error("Failed to update category:", error.message);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Category updated", data });
//   } catch (error) {
//     console.error("Error updating category:", error);
//     return NextResponse.json(
//       { error: "Failed to update category" },
//       { status: 500 }
//     );
//   }
// }
