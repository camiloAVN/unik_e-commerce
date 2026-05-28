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

No traditional API routes. Database access goes through **Next.js Server Actions** (`src/actions/`) called directly from Server and Client Components. The only API route is `/api/auth/[...nextauth]` for authentication.

### Route Groups

| Group | Base path | Description |
|-------|-----------|-------------|
| `(shop)` | `/` | Public storefront — has TopMenu + Footer layout |
| `(admin)` | `/admin` | Admin panel — has its own AdminSidebar layout, no shop chrome |
| `auth` | `/auth` | Login and registration, no layout wrapper |

### Shop Routes (`src/app/(shop)/`)

| Route | Description |
|-------|-------------|
| `/` | Home — hero slideshow, feature badges, featured categories, product grid |
| `/products` | All products with category filter pills, pagination |
| `/category/[slug]` | Dynamic category page (auto-created when a category is added in admin) |
| `/product/[slug]` | Product detail with size selector, add to cart |
| `/cart` | Cart summary |
| `/checkout/address` | Address form |
| `/checkout` | Order review + PayPal payment |
| `/orders` | Order history (authenticated) |
| `/orders/[id]` | Single order detail |
| `/contacto` | Contact form (Resend-ready, currently simulated) |

### Admin Routes (`src/app/(admin)/admin/`)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — live stat cards + Recharts charts |
| `/admin/categories` | Category CRUD (table + modal) |
| `/admin/products` | Product CRUD (table + slide-out drawer, price calculator) |
| `/admin/orders` | Paid orders — delivery toggle, filter tabs, full detail drawer |
| `/admin/customers` | Customer list + order history drawer |
| `/admin/users` | Admin users CRUD (enable/disable, cargo field) |

### State Management

| Layer | Tool | Persisted? |
|-------|------|-----------|
| Cart (items, quantities, totals) | Zustand `src/store/cart/` | Yes (localStorage) |
| UI state (sidebar, modals) | Zustand `src/store/ui/` | No |
| Saved address | Zustand `src/store/address/` | Yes (localStorage) |
| Server data | Server Actions + Prisma | Database |

Tax is calculated at 15% in the cart store (`getSummaryInformation`).

---

## Key Files

| File | Purpose |
|------|---------|
| `src/auth.ts` | NextAuth config — Credentials provider, bcryptjs, session strategy JWT |
| `src/auth.config.ts` | **CRITICAL** — `jwt` + `session` + `authorized` callbacks live HERE (not in auth.ts) so the Edge middleware can read `role` |
| `src/middleware.ts` | Route protection via NextAuth session |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/actions/index.ts` | Barrel export for all server actions |
| `src/interfaces/index.ts` | Barrel export for all TypeScript interfaces |
| `src/utils/currencyFormat.ts` | Formats numbers as COP (Colombian Peso, `es-CO` locale, dots for thousands) |
| `src/utils/generatePaginationNumber.ts` | Generates page number arrays with ellipsis |
| `src/app/globals.css` | Tailwind + `@keyframes heroProgressBar` for hero slideshow |

---

## Database Models (current schema)

### Core models

**`User`** — `id, name, email, emailVerified, password, role, image, isActive, cargo, createdAt`
- `role`: `admin | user`
- `isActive`: can be toggled by admins (cannot disable self)
- `cargo`: job title for admin users
- `createdAt`: added via migration `20260524192818_add_user_createdat`

**`Category`** — `id, name, slug, description, imageUrl, isActive, sortOrder`
- Slug auto-generated from name in admin UI
- `imageUrl` shown in `FeaturedCategories` and `/category/[slug]` banner

**`Product`** — `id, title, description, inStock, price, slug, tags, categoryId`
- Related: `images[]` (ProductImage), `orderItems[]`, `variants[]` (ProductVariant)

**`ProductVariant`** / **`VariantType`** / **`VariantValue`** / **`ProductVariantValue`**
- Flexible variant system (replaces old Size/Gender enums)
- `VariantType`: e.g. "Talla", "Color"
- `VariantValue`: e.g. "M", "Rojo"
- `ProductVariant`: a specific combination with optional `price` and `inStock`

**`Order`** — `id, subTotal, tax, total, itemsInOrder, isPaid, paidAt, isDelivered, deliveredAt, createdAt, updatedAt, transactionId, userId`
- `isDelivered` / `deliveredAt`: added via migration `20260524194135_add_order_delivery`
- Admin orders page only shows `isPaid: true` orders

**`OrderItem`** — `id, quantity, price, variantLabel, orderId, productId, productVariantId`

**`OrderAddress`** / **`UserAddress`** — shipping and profile addresses with `Country` relation

**`Country`** — seeded static list

### Enums
`Role`: `admin | user`  
*(Size and Gender enums from older versions are gone — replaced by flexible variant system)*

---

## Server Actions (`src/actions/`)

```
auth/           login, logout, register
address/        set-user-address, delete-user-address, get-user-address
order/          place-order, get-order-by-id, get-order-by-user,
                get-paginated-orders, update-order-delivery
payments/       set-transaction-id, paypal-payment
product/        product-pagination, get-product-by-slug, get-stock-by-slug,
                create-update-product, delete-product, delete-product-image
category/       get-categories, create-update-category, delete-category
user/           get-paginated-users, change-user-role,
                create-update-admin-user, delete-admin-user
contact/        send-contact-email  (Resend stub — activate when API key is set)
admin/          get-dashboard-stats (counts + monthly revenue/customers + top products)
country/        get-countries
```

**`getPaginationProductWithImages`** supports `{ page, take, categorySlug }` — used by home, `/products`, and `/category/[slug]`.

---

## Components (`src/components/`)

### UI
| Component | Location | Notes |
|-----------|----------|-------|
| `TopMenu` | `ui/top-menu/` | Fixed navbar; category dropdown panel; mobile hamburger |
| `SideBar` | `ui/side-bar/` | Role-aware: user sees Perfil/Pedidos/Cerrar, admin sees Panel administrativo |
| `Footer` | `ui/footer/` | |
| `HeroSlideshow` | `ui/hero/` | Auto-sliding carousel, `#D61C1C` dots + progress bar, `lg:h-[400px]` |
| `FeatureBadges` | `ui/feature-badges/` | 4-column trust strip, horizontal on lg, vertical on mobile |
| `FeaturedCategories` | `ui/featured-categories/` | Server component; fetches active categories; `aspect-[3/2]` cards |
| `Pagination` | `ui/pagination/` | Redesigned: COP-aware, red active page, `← Anterior / Siguiente →` |
| `Title` | `ui/title/` | |
| `PageNotFound` | `ui/not-found/` | |

### Products
| Component | Notes |
|-----------|-------|
| `ProductGrid` | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4` |
| `ProductGridItem` | Client component — image hover swap, title hover → `#D61C1C`, quantity selector, add-to-cart with "¡Agregado!" feedback, out-of-stock overlay |
| `ProductSlideShow` | Product detail desktop slideshow (Swiper) |
| `ProductMobileSlideShow` | Product detail mobile slideshow (Swiper) |
| `SizeSelector` | Used in product detail AddToCart |
| `QuantitySelector` | Used in product detail AddToCart |
| `StockLabel` | |
| `ProductImage` | Handles local `/products/` prefix vs Cloudinary URL |

### Cart / Checkout
`CartModal`, `ProductsInCart`, `OrderSummary`, `PayPalButton`

---

## NextAuth Critical Notes

**`jwt` and `session` callbacks MUST be in `src/auth.config.ts`**, not in `src/auth.ts`.  
The middleware runs on the Edge runtime and only reads `auth.config.ts`. Without this, `session.user.role` is always `undefined` → admin routes redirect to `/`.

`src/auth.ts` only contains: providers array + `session: { strategy: 'jwt' }`.

SideBar and admin logout use `signOut` from **`next-auth/react`** (client-side) — this updates `useSession` immediately. Server-side `signOut()` does not.

---

## react-icons v5.5.0 — Lucide Naming

Icons follow `[Modifier][Noun]` order (not `[Noun][Modifier]` as in older versions):

| ❌ Old (broken) | ✅ New (correct) |
|----------------|-----------------|
| `LuAlertCircle` | `LuCircleAlert` |
| `LuCheckCircle` | `LuCircleCheck` |
| `LuBarChart` | `LuChartBar` |
| `LuBarChart2` | does not exist |

**Rule**: if it fails with "Export X doesn't exist", try reversing the noun and modifier.

---

## Currency

All prices are formatted as **COP (Colombian Pesos)** via `currencyFormat()` in `src/utils/currencyFormat.ts`:
- Locale: `es-CO`, currency `COP`, 0 decimal places
- Output: `$ 45.000`, `$ 1.234.567`
- Used in: product cards, cart, checkout, order summaries, admin orders drawer, dashboard stat card

---

## Admin Dashboard Charts

Uses **Recharts** (`npm install recharts --legacy-peer-deps`).  
All chart components are `'use client'` and live in `src/app/(admin)/admin/ui/`:
- `RevenueChart` — monthly bar chart for paid orders this year
- `CustomersChart` — monthly area chart for new user registrations this year  
- `TopProductsChart` — horizontal bar chart, top 8 products by units sold

Data is fetched server-side in `page.tsx` via `getDashboardStats()` and passed as props.

---

## Contact Form (Resend)

`src/actions/contact/send-contact-email.ts` — Resend integration is written but commented out.

To activate:
1. `npm install resend`
2. Add to `.env.local`: `RESEND_API_KEY=re_xxx` and `CONTACT_TO_EMAIL=tu@correo.com`
3. Uncomment the Resend block in the action

---

## Environment Variables

```
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@localhost:5432/<DB_NAME>
AUTH_SECRET=<random secret>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token
PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders
CLOUDINARY_URL=

# Contact form (activate when ready)
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

## TypeScript

Path alias `@/*` maps to `src/*`. Zod v4 is used for form validation alongside react-hook-form.
