"use client";

import { useState, useEffect } from "react";

type Plan = {
  id: string;
  name: string;
  price: number;
  order_limit: number | null;
};

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  const restaurantId = "YOUR_CURRENT_RESTAURANT_ID"; // replace dynamically

  useEffect(() => {
    // TODO: fetch plans from Supabase if needed
    setPlans([
      { id: "free", name: "Free", price: 0, order_limit: 30 },
      { id: "pro", name: "Pro", price: 2000, order_limit: null },
      { id: "business", name: "Business", price: 5000, order_limit: null },
    ]);
  }, []);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);

    // Map plan to Stripe priceId
    const priceId =
      planId === "pro"
        ? process.env.NEXT_PUBLIC_PRICE_PRO
        : planId === "business"
        ? process.env.NEXT_PUBLIC_PRICE_BUSINESS
        : null;

    if (!priceId) return;

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, priceId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // redirect to Stripe
    } else {
      alert("Failed to create checkout session");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Billing & Plans</h1>

      <ul className="space-y-4">
        {plans.map((plan) => (
          <li key={plan.id} className="border p-4 rounded-md flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{plan.name}</h2>
              <p>
                Price: {plan.price} NPR | Order limit:{" "}
                {plan.order_limit === null ? "Unlimited" : plan.order_limit}
              </p>
            </div>
            {plan.id !== "free" && (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Upgrade
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
