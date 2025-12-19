// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { createClient } from "@/lib/supabase/server";
