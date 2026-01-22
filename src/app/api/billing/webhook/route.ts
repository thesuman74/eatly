import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata?.restaurant_id) {
      console.error("No restaurant_id in metadata");
      return NextResponse.json(
        { error: "Invalid session metadata" },
        { status: 400 },
      );
    }

    const restaurantId = session.metadata.restaurant_id;
    const priceId = session.line_items?.data?.[0]?.price?.id;

    if (!priceId) {
      console.error("No priceId found in session");
      return NextResponse.json(
        { error: "Invalid session line item" },
        { status: 400 },
      );
    }

    let planId = "pro";
    if (priceId === process.env.NEXT_PUBLIC_PRICE_BUSINESS) planId = "business";

    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        restaurant_id: restaurantId,
        plan_id: planId,
        status: "active",
        period_start: new Date(),
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .eq("restaurant_id", restaurantId);

    if (error) console.error("Supabase update error:", error.message);
  }

  return NextResponse.json({ received: true });
}
