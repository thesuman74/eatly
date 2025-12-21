// app/api/orders/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await context.params;
  const supabase = await createClient();

  // console.log("orderId", orderId);

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch order metadata
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  // console.log("order", order);

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 2️⃣ Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  // console.log("items", items);

  // 2️⃣ Get product IDs
  const productIds = items?.map((i) => i.product_id) || [];

  // 3️⃣ Fetch product details
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(`*, product_images(*)`)
    .in("id", productIds);

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  // ✅ Ensure products is always an array
  const products: typeof productsData = productsData || [];

  // 4️⃣ Merge items with product info
  const itemsWithDetails = items?.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.product_id) || null, // fallback to null
  }));

  // console.log(" itemsWithDetails", itemsWithDetails);

  // 3️⃣ Fetch addons for each item
  const itemIds = items?.map((i) => i.id) || [];
  const { data: addons } = await supabase
    .from("order_item_addons")
    .select("*")
    .in("order_item_id", itemIds);

  // attach addons to items
  const itemsWithAddons =
    items?.map((item) => ({
      ...item,
      addons: addons?.filter((a) => a.order_item_id === item.id) || [],
    })) || [];

  // console.log("itemsWithAddons", itemsWithAddons);

  // 4️⃣ Fetch payments
  const { data: payments } = await supabase
    .from("order_payments")
    .select("*")
    .eq("order_id", orderId);

  // console.log("payments", payments);

  // 5️⃣ Fetch status logs (optional)
  const { data: status_logs } = await supabase
    .from("order_status_logs")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  // 6️⃣ Return structured response
  return NextResponse.json({
    ...order,
    items: itemsWithDetails || [],
    payments: payments || [],
    status_logs: status_logs || [],
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: orderId } = await context.params;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const body: CreateOrderPayload = await req.json();
  const { order, items, payment } = body;

  try {
    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify restaurant ownership once
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

    // 3️⃣ Fetch existing order with payment_status
    const { data: existingOrder, error: existingError } = await supabase
      .from("orders")
      .select("subtotal, total, payment_status")
      .eq("id", orderId)
      .single();

    if (existingError || !existingOrder) {
      throw new Error("Order not found");
    }

    // 4️⃣ Calculate updated order totals if items exist
    const hasItemsUpdate = Array.isArray(items) && items.length > 0;
    let subtotal = existingOrder.subtotal;
    let total = existingOrder.total;

    if (hasItemsUpdate) {
      subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
      total = subtotal + (payment?.tip ?? 0);
    }

    // 5️⃣ Update order metadata (excluding payment_status for now)
    const { data: updatedOrder, error: orderError } = await supabase
      .from("orders")
      .update({
        customer_name: order.customer_name ?? null,
        notes: order.notes ?? null,
        order_type: order.order_type ?? null,
        subtotal,
        total,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError || !updatedOrder) {
      throw new Error(orderError?.message || "Order update failed");
    }

    // 6️⃣ Update order items if provided
    if (hasItemsUpdate) {
      const itemsPayload = items.map((i) => ({
        order_id: orderId,
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
        notes: i.notes ?? null,
        restaurant_id: order.restaurant_id ?? null,
      }));

      // Delete previous items
      const { error: deleteItemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId)
        .eq("restaurant_id", order.restaurant_id);

      if (deleteItemsError) throw new Error(deleteItemsError.message);

      // Insert new items
      const { error: insertItemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (insertItemsError) throw new Error(insertItemsError.message);
    }

    // 7️⃣ Handle payment as the single source of truth
    if (payment) {
      // Fetch existing payment
      const { data: existingPayment, error: paymentFetchError } = await supabase
        .from("order_payments")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (paymentFetchError && paymentFetchError.code !== "PGRST116") {
        throw new Error(paymentFetchError.message);
      }

      // Block duplicate payment
      if (existingPayment && existingPayment.amount_paid > 0) {
        return NextResponse.json(
          { error: "Payment already completed for this order" },
          { status: 400 }
        );
      }

      const paymentPayload = {
        order_id: orderId,
        method: payment.method ?? null,
        amount_paid: payment.amount_paid ?? null,
        tip: payment.tip ?? null,
        change_returned: payment.change_returned ?? null,
        restaurant_id: order.restaurant_id ?? null,
      };

      // Insert or update payment
      if (existingPayment) {
        const { error: paymentError } = await supabase
          .from("order_payments")
          .update(paymentPayload)
          .eq("order_id", orderId);

        if (paymentError) throw new Error(paymentError.message);
      } else {
        const { error: paymentError } = await supabase
          .from("order_payments")
          .insert(paymentPayload);

        if (paymentError) throw new Error(paymentError.message);
      }

      // Update order payment_status after payment is saved
      const newPaymentStatus =
        payment.amount_paid && payment.amount_paid > 0
          ? PAYMENT_STATUS.PAID
          : PAYMENT_STATUS.UNPAID;

      const { error: orderStatusError } = await supabase
        .from("orders")
        .update({ payment_status: newPaymentStatus })
        .eq("id", orderId);

      if (orderStatusError) throw new Error(orderStatusError.message);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
