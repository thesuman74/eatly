// app/api/orders/[id]/route.ts
import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const restaurantId = url.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }
    const supabase = await createClient();

    //Authenticate use

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3. Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.READ_ORDER_INFO,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 4. Role-based scoping
    let query = supabase.from("restaurants").select("*").eq("id", restaurantId);

    if (userData.role === UserRoles.OWNER) {
      query = query.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== restaurantId) {
        return NextResponse.json(
          { error: "Resource access denied" },
          { status: 403 }
        );
      }
    }

    const { data: restaurant, error } = await query.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    // 1️⃣ Fetch order metadata
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
    *,
    payments:order_payments (
      payment_status
    )
  `
      )
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2️⃣ Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .eq("restaurant_id", restaurantId);

    // 2️⃣ Get product IDs
    const productIds = items?.map((i) => i.product_id) || [];

    // 3️⃣ Fetch product details
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(`*, product_images(*)`)
      .eq("restaurant_id", restaurantId)
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

    // 3️⃣ Fetch addons for each item
    const itemIds = items?.map((i) => i.id) || [];
    const { data: addons } = await supabase
      .from("order_item_addons")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .in("order_item_id", itemIds);

    // attach addons to items
    const itemsWithAddons =
      items?.map((item) => ({
        ...item,
        addons: addons?.filter((a) => a.order_item_id === item.id) || [],
      })) || [];

    // console.log("itemsWithAddons", itemsWithAddons);

    // 4️⃣ Fetch payments
    const { data: payments, error: paymentsError } = await supabase
      .from("order_payments")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("order_id", orderId);

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
    }

    // Determine payment_status based on actual payment records
    let payment_status_corrected = "unpaid";

    if (payments && payments.length > 0) {
      if (payments.some((p) => p.payment_status === "paid")) {
        payment_status_corrected = "paid"; // any payment marked as paid
      } else if (payments.every((p) => p.payment_status === "refunded")) {
        payment_status_corrected = "refunded"; // all refunded
      } else {
        payment_status_corrected = "unpaid"; // all unpaid
      }
    }

    // 5️⃣ Fetch status logs (optional)
    const { data: status_logs } = await supabase
      .from("order_status_logs")
      .select("*")
      .eq("order_id", orderId)
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: true });

    // 6️⃣ Return structured response
    return NextResponse.json({
      ...order,
      payment_status: payment_status_corrected,
      items: itemsWithDetails || [],
      payments: payments || [],
      status_logs: status_logs || [],
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    const clientRestaurantId = order?.restaurant_id;
    if (!clientRestaurantId) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Authenticate
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3️⃣ Permission check (correct one)
    if (
      !can({
        role: userData.role,
        permission: Permission.MODIFY_ORDER_ITEMS,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 4️⃣ Fetch existing order (server truth)
    const { data: existingOrder, error: orderFetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5️⃣ Verify client restaurant_id matches order
    if (existingOrder.restaurant_id !== clientRestaurantId) {
      return NextResponse.json(
        { error: "Restaurant mismatch" },
        { status: 403 }
      );
    }

    // 6️⃣ Role-based restaurant access (multi-restaurant safe)
    let restaurantQuery = supabase
      .from("restaurants")
      .select("id")
      .eq("id", clientRestaurantId);

    if (userData.role === UserRoles.OWNER) {
      restaurantQuery = restaurantQuery.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== clientRestaurantId) {
        return NextResponse.json(
          { error: "Not authorized for this restaurant" },
          { status: 403 }
        );
      }
    }

    const { data: restaurant, error: restError } =
      await restaurantQuery.single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // 7️⃣ Fetch existing payment
    const { data: existingPayment } = await supabase
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    // Block paid orders
    if (existingPayment?.payment_status === PAYMENT_STATUS.PAID) {
      return NextResponse.json(
        { error: "Paid orders cannot be updated" },
        { status: 400 }
      );
    }

    // 8️⃣ Recompute prices if items are updated
    let subtotal = existingOrder.subtotal;
    let total = existingOrder.total;

    let computedItems: any[] | null = null;

    if (Array.isArray(items) && items.length > 0) {
      const productIds = items.map((i) => i.product_id);

      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, price")
        .in("id", productIds)
        .eq("restaurant_id", clientRestaurantId);

      if (productError || !products || products.length !== productIds.length) {
        return NextResponse.json(
          { error: "Invalid product selection" },
          { status: 400 }
        );
      }

      const priceMap = new Map(products.map((p) => [p.id, p.price]));

      computedItems = items.map((item) => {
        const unitPrice = priceMap.get(item.product_id);
        if (unitPrice == null) {
          throw new Error("Invalid product price");
        }

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity,
          notes: item.notes ?? null,
        };
      });

      subtotal = computedItems.reduce((sum, i) => sum + i.total_price, 0);
      total = subtotal + (payment?.tip ?? 0);
    }

    // 9️⃣ Update order (no restaurant_id mutation)
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        customer_name: order.customer_name ?? null,
        notes: order.notes ?? null,
        order_type: order.order_type ?? null,
        subtotal,
        total,
      })
      .eq("id", orderId)
      .eq("restaurant_id", clientRestaurantId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      throw new Error(updateError?.message || "Order update failed");
    }

    // 🔟 Replace order items if provided
    if (computedItems) {
      await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId)
        .eq("restaurant_id", clientRestaurantId);

      const itemsPayload = computedItems.map((item) => ({
        ...item,
        order_id: orderId,
        restaurant_id: clientRestaurantId,
      }));

      const { error: itemsInsertError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsInsertError) {
        throw new Error(itemsInsertError.message);
      }
    }

    // 1️⃣1️⃣ Payment update
    let finalPaymentStatus: string = PAYMENT_STATUS.UNPAID;

    if (payment) {
      const amountPaid = payment.amount_paid ?? 0;
      finalPaymentStatus =
        amountPaid >= total ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNPAID;

      const paymentPayload = {
        order_id: orderId,
        method: payment.method ?? null,
        amount_paid: amountPaid,
        tip: payment.tip ?? 0,
        change_returned: Math.max(0, amountPaid - total),
        restaurant_id: clientRestaurantId,
        payment_status: finalPaymentStatus,
      };

      if (existingPayment) {
        await supabase
          .from("order_payments")
          .update(paymentPayload)
          .eq("order_id", orderId);
      } else {
        await supabase.from("order_payments").insert(paymentPayload);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        ...updatedOrder,
        payment_status: finalPaymentStatus,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
