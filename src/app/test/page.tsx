"use client";

// src/components/pages/home-page.tsx

import React from "react";
import { useCounterStore } from "@/components/HOC/ProductCartProvider";

const page = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state
  );
  return (
    <div>
      <div>
        Count: {count}
        <hr />
        <button type="button" onClick={incrementCount}>
          Increment Count
        </button>
        <button type="button" onClick={decrementCount}>
          Decrement Count
        </button>
      </div>
    </div>
  );
};

export default page;
