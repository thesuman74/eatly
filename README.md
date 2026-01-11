# Eatly – SaaS Restaurant Management System

## Overview

**Eatly** is a SaaS-based, multi-tenant Restaurant Management System designed to streamline daily restaurant operations on a single, secure platform.  
It enables multiple restaurants to operate independently under one system while ensuring strict data isolation, role-based access control, and real-time operational visibility.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)

---

## Project OverView

### Purpose

This project is built to help restaruants and hotels owners to help them manage their restaurants serverices like Managing menus adding categories managing Staffs and tracking transactions and other details

The main goal of this project is to enable all Small to medium large scale business owners to To move into more digital way of managing their systems.

### Key features

The main key features of this projects are :

- Multi-restaurant(multi-tenant) support
- Role-based access (Owner , Manager, Staffs, Customers)
- Menu Management (Categories and products)
- Order life cycle Management
- Payments
- Subscriptions and plans
- Real-time updates
- Notifications

## System Architecture

Eatly follows a modular, SaaS-oriented architecture designed for scalability, security, and maintainability.

**Architectural Overview**

- Clear separation between _frontend_, _backend_, and _database_ layers
- Tenant-aware request handling to support multi-restaurant isolation
- Centralized authentication and role-based authorization layer
- Real-time communication layer for live order and status updates

## Tech Stack

- Frontend : Nextjs , tailwindcss
- Backend: Nextjs API routes
- Databases: PostgreSql (supabase)
- Authentication: Supabase Auth
- Payments: Stripe
- Notifications: Supabase realtime
- Caching & Server State Management: React Query
- Client State Management: Zustand

### Design Princiiples and Decisions

Followed a structured and professional Folder structure based on following concerns

- **Separation of Concerns:**  
  Parent components handle business logic and functionality, while UI components remain dumb, reusable, and logic-free.

- **Organized Code Structure:**  
  Clear separation between API services, custom hooks, and state management with React Query.

- **Reusability & Modularity:**  
  Components and hooks are designed to be reusable across multiple features.

  - **Consistency & Maintainability:**  
    Folder structure and naming conventions are consistent across the frontend and backend layers.

More information about <br>

- [Folder Structure](docs/folder-structure.md) documentation

## Multi-Tenancy and Data isolation

Eatly is built as a **multi-tenant SaaS platform**, ensuring that multiple restaurants can operate independently on the same system while maintaining strict data isolation.

- **Tenant Concept:**  
  Each restaurant is treated as a separate tenant, with its own set of data including menus, orders, staff, and transactions.

- **Data Isolation:**  
  All database queries are scoped using a `restaurantId` , ensuring that no data leaks between restaurants. Row-level security and tenant-aware APIs enforce this separation at both backend and database levels.

## Role-Based Access Control (RBAC)

**|Role-based access control (RBAC)** to ensure secure and scoped access for all users within a restaurant.  
Permissions are enforced at **three layers**: frontend UI, backend APIs, and database level.

### Role Definitions

- **Owner:**  
  Full access to restaurant settings, subscription management, menus, staff, and reports.

- **Manager:**  
  Can manage menus, orders, and staff operations, but cannot modify subscription or owner-level settings.

- **Staff:**  
  Limited access to order handling, table updates, and operational tasks based on assigned permissions.

- **Customer:**  
  Access to place orders, view order status, and receive notifications (if integrated).

### Permission Boundaries and Security Layers

1. **Frontend / UI:**

   - Reusable **action guards** control visibility, enable/disable actions, and hide/show elements based on user role.
   - Ensures users only see actions they are permitted to perform.

2. **Backend / API Layer:**

   - All API routes are filtered with **reusable permission checks**.
   - Validates both user role and restaurant ownership before executing any operation.
   - Prevents unauthorized actions even if frontend is bypassed.

3. **Database Layer:**
   - **Row-Level Security (RLS)** enforces tenant and role-based restrictions directly at the database level.
   - Acts as the last line of defense to ensure strict data isolation and compliance.

This **multi-layered RBAC design** ensures a secure, scalable, and tamper-resistant system, maintaining integrity across UI, API, and database layers.

## Order Management & Lifecycle

Eatly provides a complete **order management system** with support for multiple order types and a well-defined lifecycle.  
All transitions are **role-aware** and **tenant-scoped** to ensure operational integrity.

### Supported Order Types

- **Dine-In:** Orders placed and served within the restaurant.
- **Takeaway:** Orders placed for pickup by customers.
- **Delivery:** Orders placed for delivery, with status updates visible to kitchen and delivery staff.

### Order Lifecycle States

Orders follow a structured lifecycle:

```mermaid
  Draft --> Accepted
  Accepted --> Preparing
  Preparing --> Ready
  Ready --> Completed
  Draft --> Cancelled
  Accepted --> Cancelled
```

## Menu Management

A robust **menu management system** that allows restaurants to organize and maintain their offerings efficiently.

### Categories

- Add, update, or remove categories
- Toggle visibility (show/hide categories for customers)
- Duplicate existing categories for faster setup

### Products / Menu Items

- Add, update, or remove products
- Set pricing, availability, and visibility
- Duplicate existing products to speed up menu creation

## Scan and Import Menu with Google Gemini

- Restaurants can **upload a photo of their existing menu**
- Google Gemini API automatically **extracts categories, product names, and prices**
- Items are imported directly into Eatly with optional **image assignment** for products
- Reduces manual data entry and accelerates menu setup

---

## Owner and Staff Management

Eatly provides a structured system for managing restaurant ownership and staff operations, ensuring **role-based access** and secure onboarding.

#### Restaurant Owner

- The first user to register is considered the **restaurant owner**.
- Owner provides basic restaurant information, such as **restaurant name** and **type** (e.g., restaurant, hotel, cafe).
- Owner has full administrative access and can manage staff, menus, orders, and subscriptions.

#### Staff Invitation Flow

1. **Invitation:**  
   Owner sends an invitation link to staff via email, specifying their role and permissions.

2. **Onboarding:**

   - Staff clicks the invitation link from their email.
   - They are automatically logged in and redirected to the **staff onboarding page**.
   - Staff provides their information, including full name, phone number, and password.

3. **Role Assignment:**

   - Only the **owner** can assign or modify staff roles.
   - Roles define the scope of actions the staff can perform in the system.

4. **Permission-Based Access:**
   - Staff actions are restricted based on their assigned roles and permissions.
   - Permissions are enforced across **UI, backend, and database layers** for security and integrity.

### Payments

It supports multiple payment methods and integrates seamlessly with the order management system.

- **Supported Payment Methods:**

  - Cash
  - QR-based payments
  - Online payments via Stripe

- **Payment Status Handling:**

  - `Unpaid` – Payment pending
  - `Paid` – Payment completed
  - `Refunded` – Payment returned to the customer

- **Order-Payment Relationship:**
  - Each order is linked to its corresponding payment record
  - Payment status updates are reflected in real-time on both staff and customer dashboards

## SaaS Subscription Model

It implements a **plan-based subscription system** to manage feature access and billing per restaurant.

| Feature / Aspect             | Description                                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plan-Based System**        | Restaurants subscribe to plans that define available features and usage limits.                                                              |
| **Feature Limits per Plan**  | Access to staff accounts, orders, menus, and other features can be restricted per plan.                                                      |
| **Stripe Integration**       | Recurring payments and billing are managed via Stripe (monthly and yearly plans).                                                            |
| **Subscription Enforcement** | Active subscription status is enforced per restaurant to control feature access.                                                             |
| **Billing Lifecycle**        | - **Active:** Full access to features.<br>- **Expired:** Access may be restricted.<br>- **Grace Period:** Temporary access to allow renewal. |

---

## Future Enhancements and Features

Planned improvements for Eatly include:

- Advanced reporting and analytics dashboards
- Mobile application for staff and customers
- Integration with additional payment gateways
- AI-powered recommendations for menu optimization
- Automated notifications and alerts for order and staff management
- Loyalty programs and customer engagement features

---

## Project Status

- Eatly is currently under active development.
