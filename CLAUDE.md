# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Turbopack)
npm run build      # Build for production (Turbopack)
npm start          # Start production server
npm run lint       # Run ESLint

# Database
docker compose up -d               # Start PostgreSQL container
npx prisma migrate dev             # Apply schema changes
npx prisma studio                  # Open Prisma GUI
npm run seed                       # Seed database with sample data
```

## Architecture Overview

Full-stack e-commerce clothing store built with **Next.js 15 App Router**, **Prisma + PostgreSQL**, and **next-auth v5 (beta)**.

### Data Flow Pattern

The app avoids traditional API routes. Database access goes through **Next.js Server Actions** (`src/actions/`) which are called directly from Server and Client Components. The only API route is `/api/auth/[...nextauth]` for authentication.

### Route Structure

- `src/app/(shop)/` — public shop routes (product catalog, cart, checkout, orders, profile, admin)
- `src/app/auth/` — login and registration pages
- Route protection is handled in `src/middleware.ts` via next-auth; admin routes additionally check `role === 'admin'` in `src/auth.config.ts`

### State Management Split

| Layer | Tool | Persisted? |
|-------|------|-----------|
| Cart (items, quantities, totals) | Zustand (`src/store/cart/`) | Yes (localStorage) |
| UI state (sidebar, modals) | Zustand (`src/store/ui/`) | No |
| Saved address | Zustand (`src/store/address/`) | Yes (localStorage) |
| Server data | Server Actions + Prisma | Database |

Tax is calculated at 15% in the cart store.

### Key Files

- `src/auth.ts` — NextAuth config (Credentials provider, bcryptjs password check)
- `src/auth.config.ts` — Route authorization callbacks
- `src/middleware.ts` — Protects routes using NextAuth session
- `src/lib/prisma.ts` — Prisma client singleton (prevents multiple instances in dev)
- `src/actions/index.ts` — Barrel export for all server actions
- `src/interfaces/index.ts` — Barrel export for all TypeScript interfaces

### Database Models

Core models: `User`, `Product`, `ProductImage`, `Category`, `Order`, `OrderItem`, `OrderAddress`, `UserAddress`, `Country`.

Key enums: `Size` (XS–XXXL), `Gender` (men/women/kid/unisex), `Role` (admin/user).

### External Services

- **PayPal** — payment processing (sandbox URLs in `.env`)
- **Cloudinary** — product image storage; URLs are configured as allowed remote patterns in `next.config.ts`

## Environment Setup

Copy `.env.template` to `.env.local` and fill in:

```
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@localhost:5432/<DB_NAME>
AUTH_SECRET=<random secret>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token
PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders
CLOUDINARY_URL=
```

## TypeScript

Path alias `@/*` maps to `src/*`. Zod v4 is used for form validation alongside react-hook-form.
