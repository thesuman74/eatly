import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    console.log("body", body);
    const {
      restaurant_id,
      order_type,
      customer,
      notes,
      items,
      payment,
      guest_id,
      order_source,
    } = body;

    // 1️⃣ Validate
    if (!restaurant_id || !order_type || !items?.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 2️⃣ Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id,
        order_type,
        status: "draft",

        // customer
        customer_name: customer?.name ?? null,
        customer_phone: customer?.phone ?? null,
        customer_address: customer?.address ?? null,
        notes: notes ?? null,

        // guest tracking
        guest_id: guest_id ?? null,

        // order source
        order_source: order_source ?? "web",

        // financials (public-safe defaults)
        subtotal: 0,
        tax: 0,
        delivery_fee: 0,
        total: 0,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Order creation failed", orderError },
        { status: 500 }
      );
    }

    // 3️⃣ Fetch product prices (server truth)
    const productIds = items.map((i: any) => i.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds)
      .eq("restaurant_id", restaurant_id);

    // 4️⃣ Insert order_items
    const orderItems = items.map((item: any) => {
      const product = products?.find((p) => p.id === item.product_id);
      if (!product) throw new Error("Invalid product");

      return {
        order_id: order.id,
        restaurant_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
      };
    });

    await supabase.from("order_items").insert(orderItems);

    // 5️⃣ Create unpaid payment row (optional)
    if (payment?.method) {
      await supabase.from("order_payments").insert({
        order_id: order.id,
        restaurant_id,
        method: payment.method,
        amount_paid: 0,
        payment_status: "unpaid",
      });
    }

    return NextResponse.json(
      { success: true, order_id: order.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
