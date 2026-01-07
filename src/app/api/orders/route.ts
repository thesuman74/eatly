// app/api/orders/route.ts
import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required restaurantId" },
        { status: 400 }
      );
    }

    // 1. Authenticate user
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

    // 5. Fetch orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId);

    if (!orders || orders.length === 0)
      return NextResponse.json([], { status: 200 });

    const orderIds = orders.map((o) => o.id);

    // 6. Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    // 7. Fetch addons
    const itemIds = items?.map((i) => i.id) || [];
    const { data: addons } = await supabase
      .from("order_item_addons")
      .select("*")
      .in("order_item_id", itemIds);

    // 8. Fetch payments
    const { data: payments } = await supabase
      .from("order_payments")
      .select("*")
      .in("order_id", orderIds);

    // 9. Assemble orders
    const ordersWithTotals = orders.map((order) => {
      const orderItems = items?.filter((i) => i.order_id === order.id) || [];

      // Only include addons relevant to this order's items
      const orderAddons = orderItems.flatMap(
        (item) => addons?.filter((a) => a.order_item_id === item.id) || []
      );

      const orderPayments =
        payments?.filter((p) => p.order_id === order.id) || [];

      const itemsTotal = orderItems.reduce((acc, item) => {
        const addonTotal = orderAddons
          .filter((a) => a.order_item_id === item.id)
          .reduce((sum, a) => sum + a.price * a.quantity, 0);
        return acc + item.unit_price * item.quantity + addonTotal;
      }, 0);

      const totalAmount =
        itemsTotal + (order.tax || 0) + (order.delivery_fee || 0);

      let payment_status = "unpaid";
      if (orderPayments.length > 0) {
        if (orderPayments.some((p) => p.payment_status === "paid"))
          payment_status = "paid";
        else if (orderPayments.every((p) => p.payment_status === "refunded"))
          payment_status = "refunded";
      }

      return {
        ...order,
        payment_status,
        items: orderItems,
        addons: orderAddons,
        payments: orderPayments,
        total_amount: totalAmount,
      };
    });

    console.log("ordersWithTotals", ordersWithTotals);

    return NextResponse.json(ordersWithTotals);
  } catch (error: any) {
    console.error("Error fetching orders:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateOrderPayload = await req.json();
    const { order, items, payment } = body;

    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Validate restaurant_id
    if (!order.restaurant_id) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4️⃣ Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.CREATE_ORDER,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 5️⃣ Role-based restaurant scoping
    let restaurantQuery = supabase
      .from("restaurants")
      .select("id")
      .eq("id", order.restaurant_id);

    if (userData.role === UserRoles.OWNER) {
      restaurantQuery = restaurantQuery.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== order.restaurant_id) {
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

    // 6️⃣ Fetch product prices (DO NOT trust client)
    const productIds = items.map((i) => i.product_id);

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds)
      .eq("restaurant_id", restaurant.id);

    if (productError || !products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Invalid product selection" },
        { status: 400 }
      );
    }

    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    const computedItems = items.map((item) => {
      const unitPrice = priceMap.get(item.product_id);
      if (unitPrice == null) {
        throw new Error("Invalid product price");
      }

      return {
        ...item,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
      };
    });

    // 7️⃣ Calculate totals safely
    const subtotal = computedItems.reduce((sum, i) => sum + i.total_price, 0);

    const tip = payment?.tip ?? 0;
    const total = subtotal + tip;

    const amountPaid = payment?.amount_paid ?? 0;
    const paymentStatus =
      amountPaid >= total ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNPAID;

    const changeReturned = Math.max(0, amountPaid - total);

    // 8️⃣ Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: order.customer_name ?? null,
        order_type: order.order_type ?? null,
        subtotal,
        total,
        notes: order.notes ?? null,
        restaurant_id: restaurant.id,
        order_source: order.order_source ?? null,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || "Order insertion failed");
    }

    // 9️⃣ Insert order items
    const itemsPayload = computedItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes ?? null,
      restaurant_id: newOrder.restaurant_id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // 🔟 Insert payment (if present)
    if (payment) {
      const { error: paymentError } = await supabase
        .from("order_payments")
        .insert({
          order_id: newOrder.id,
          method: payment.method,
          amount_paid: amountPaid,
          tip,
          change_returned: changeReturned,
          restaurant_id: newOrder.restaurant_id,
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
