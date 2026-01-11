# Eatly – Folder Structure Documentation

**Project Notes:** Eatly
**Date:** 2025-12-16

This document outlines the **folder and file structure** for the Eatly multi-tenant restaurant management system. It explains key directories, responsibilities, and best practices for organizing code.

---

## Multi-Tenant Structure

- Each restaurant is treated as a tenant, identified by `[restaurantSlug]` in the path.
- **Example URLs:** `/kajichiya1`, `/kajichiya2`
- `restaurant_id` is stored in the database and used in server/services to scope data.

---

## Public Folder Structure (`src/app/(public)/[restaurantSlug]/`)

```
src/app/(auth)/
├─ login/         ← Login page
├─ register/      ← Signup page
└─ logout/        ← Logout actions
```

```
[restaurantSlug]/
├─ menu/          ← Show categories and products
├─ cart/          ← Guest cart and checkout
└─ page.tsx       ← Restaurant landing page
```

---

## State Management (`src/stores/`)

```
src/stores/
├─ admin/                  ← Stores for dashboard/admin
│  ├─ categoryStore.ts
│  └─ ...
├─ user/                   ← Stores for public/customer
│  ├─ cartStore.ts
│  └─ ...
├─ ui/                    ← UI-specific states (modals, sheets, panels)
│  ├─ paymentPanelStore.ts
│  └─ ...
```

---

## Custom Hooks (`src/hooks/`)

```
src/hooks/
├─ category/            ← Category-related hooks
│  ├─ useAddCategory.ts
│  ├─ useDeleteCategory.ts
│  └─ useUpdateCategory.ts
├─ products/            ← Product-related hooks
│  ├─ useProducts.ts
│  └─ useProductActions.ts
├─ orders/              ← Order-related hooks
│  └─ useOrders.ts
└─ ui/                  ← UI helpers/hooks (mobile, modal, sheet)
    └─ useMobile.tsx
```

---

## Library (`src/lib/`)

```
src/lib/
├─ supabase/            ← Supabase clients & server helpers
│  ├─ client.ts
│  ├─ server.ts
│  └─ serverService.ts
├─ actions/             ← Business logic functions
│  ├─ authActions.ts
│  ├─ orderActions.ts
│  └─ uploadImages.ts
├─ types/               ← TypeScript types
│  ├─ menu-types.ts
│  ├─ order-types.ts
│  └─ items-types.ts
└─ utils/               ← Generic utilities
    ├─ date.ts
    ├─ time.ts
    └─ buildOrderPayload.ts
```

**Note:** Only generic, reusable functions should live in `src/lib/utils/`. Domain-specific helpers should be in their respective service folders (e.g., `services/menu/utils.ts`).

---

## Services (`src/services/`)

```
src/services/
├─ auth/
├─ restaurant/          ← Restaurant logic, creation, setup
├─ menu/                ← Categories, products services
├─ orders/
└─ payments/
```

- Handles **API calls, business logic, and database interactions**
- Follows the flow: **UI → Action → Service → Database**

---

## API Routes (`src/app/api/`)

```
src/app/api/
├─ auth/
│  └─ [...nextauth]/route.ts
├─ gemini/
│  └─ route.ts
├─ menu/
│  ├─ categories/      ← GET, POST, PATCH, DELETE
│  │   └─ route.ts
│  ├─ products/
│  │   └─ route.ts
│  └─ import/
│      └─ route.ts
├─ orders/
│  ├─ index/           ← GET list / POST create
│  │   └─ route.ts
│  ├─ [orderId]/       ← GET, PATCH, DELETE
│  │   └─ route.ts
│  └─ [orderId]/status/
│      └─ route.ts
```

---

## Utilities (`src/utils/`)

```
src/utils/
├─ date.ts               ← Date/time helpers
├─ time.ts               ← Time formatting / calculations
├─ buildOrderPayload.ts  ← Order payload builder
├─ fetcher.ts            ← Generic fetch/Axios helpers
└─ index.ts              ← Central exports (optional)
```

**Guidelines:** Only put **generic, reusable functions** here. Domain-specific helpers should remain in the respective service folder.

---

## Security & Policies

1. Policy enforcement at multiple layers (frontend, backend, database)
2. Conditional checks for tenant ownership and role-based access
