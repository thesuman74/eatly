// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status");

  // 1️⃣ Fetch orders with optional status
  let query = supabase
    .from("orders")
    .select(
      `
    *,
    payments:order_payments (
      payment_status
    )
  `
    )
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: orders, error } = await query;

  console.log("orders", orders);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // 2️⃣ Compute total for each order (items + addons + tip)
  const orderIds = orders.map((o) => o.id);

  // fetch items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  // fetch addons
  const itemIds = items?.map((i) => i.id) || [];
  const { data: addons } = await supabase
    .from("order_item_addons")
    .select("*")
    .in("order_item_id", itemIds);

  // fetch payments (to include tip)
  const { data: payments } = await supabase
    .from("order_payments")
    .select("*")
    .in("order_id", orderIds);

  const ordersWithTotals = orders.map((order) => {
    const orderItems = items?.filter((i) => i.order_id === order.id) || [];
    const orderAddons = addons || [];
    const orderPayments =
      payments?.filter((p) => p.order_id === order.id) || [];

    // Calculate items + addons total
    const itemsTotal = orderItems.reduce((acc, item) => {
      const addonTotal = orderAddons
        .filter((a) => a.order_item_id === item.id)
        .reduce((a, b) => a + b.price * b.quantity, 0);
      return acc + item.unit_price * item.quantity + addonTotal;
    }, 0);

    // Sum all payments (including negative refunds) + tips
    const netPayment = orderPayments.reduce(
      (acc, p) => acc + (p.amount_paid || 0) + (p.tip || 0),
      0
    );

    // Determine payment_status
    let payment_status = "unpaid";
    if (orderPayments.length > 0) {
      if (netPayment === 0) {
        payment_status = "refunded"; // fully refunded
      } else if (netPayment > 0) {
        payment_status = "paid"; // paid amount still remains
      }
    }

    return {
      ...order,
      payment_status,
      items: orderItems,
      addons: orderAddons,
      payments: orderPayments,
      total_amount: itemsTotal,
      order_number: order.order_number,
    };
    // console.log("formattedOrder", formattedOrder);

    // return formattedOrder;

    // return {
    //   id: order.id,
    //   customer_name: order.customer_name,
    //   order_type: order.order_type,
    //   status: order.status,
    //   payment_status: payments?.[0]?.payment_status || "unpaid",
    //   created_at: order.created_at,
    //   total_amount: itemsTotal + tipsTotal,
    //   order_number: order.order_number,
    // };
  });

  return NextResponse.json(ordersWithTotals);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body: CreateOrderPayload = await req.json();
  const { order, items, payment } = body;

  console.log("body", body);

  try {
    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify restaurant ownership
    if (!order.restaurant_id) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      );
    }

    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", order.restaurant_id)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // 3️⃣ Calculate amounts safely
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const tip = payment?.tip ?? 0;
    const total = subtotal + tip;

    const paymentStatus =
      payment?.amount_paid && payment.amount_paid > 0
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.UNPAID;

    // 4️⃣ Insert order with verified restaurant_id
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: order.customer_name ?? null,
        order_type: order.order_type ?? null,
        subtotal,
        total,
        notes: order.notes ?? null,
        restaurant_id: restaurant.id, // ✅ must include
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || "Order insertion failed");
    }

    // 5️⃣ Insert order items
    const itemsPayload = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes ?? null,
      restaurant_id: order.restaurant_id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // 6️⃣ Insert payment ONLY if paid
    if (payment) {
      const { error: paymentError } = await supabase
        .from("order_payments")
        .insert({
          order_id: newOrder.id,
          method: payment.method,
          amount_paid: payment.amount_paid,
          tip: payment.tip ?? 0,
          change_returned: payment.change_returned ?? 0,
          restaurant_id: order.restaurant_id,
          payment_status: paymentStatus,
        });

      if (paymentError) {
        throw new Error(paymentError.message);
      }
    }

    return NextResponse.json({
      success: true,
      order_id: newOrder.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
