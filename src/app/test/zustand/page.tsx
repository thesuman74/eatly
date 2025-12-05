"use client";
import React, { useState } from "react";
import { useAdminProductStore } from "@/stores/admin-product-store";

export default function TestZustand() {
  const [input, setInput] = useState("");
  const products = useAdminProductStore((state) => state.products);
  const addProduct = useAdminProductStore((state) => state.addProduct);
  const removeProduct = useAdminProductStore((state) => state.removeProduct);

  return (
    <div className="p-4">
      <h2>Test Zustand Store</h2>
      <input
        type="text"
        placeholder="Product name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-1"
      />
      <button
        onClick={() => {
          addProduct(input);
          setInput("");
        }}
        className="ml-2 bg-blue-500 text-white px-2 py-1"
      >
        Add Product
      </button>

      <ul className="mt-4">
        {products.map((p) => (
          <li key={p}>
            {p}{" "}
            <button
              onClick={() => removeProduct(p)}
              className="text-red-500 ml-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
