# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains an Express API server and a KDO Cameroun mobile app built with Expo.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (for general use; auth uses JSON file storage)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) with Expo Router

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (port 8080)
│   │   └── src/routes/auth.ts  # Auth endpoints (register/login/me/logout/profile)
│   └── mobile/             # KDO Cameroun Expo mobile app
│       ├── app/            # Expo Router screens
│       │   ├── (tabs)/     # Tab screens (Accueil, Catégories, Promos, Panier, Profil)
│       │   ├── product/    # Product detail screen
│       │   └── auth/       # Auth screens (login.tsx, register.tsx)
│       ├── components/     # Shared UI components (HeroBanner, ProductCard, etc.)
│       ├── context/        # CartContext, AuthContext
│       ├── data/           # products.ts (24 products with real GitHub images)
│       └── constants/      # colors.ts
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
└── pnpm-workspace.yaml     # pnpm workspace config
```

## KDO Cameroun Mobile App

### Features
- **5-tab navigation**: Accueil, Catégories, Promos, Panier, Profil
- **24 real products** with images from GitHub (kdocameroun.vercel.app repository)
- **Hero banner** with real KDO store photos (animated, 4 slides)
- **Real KDO logo** from GitHub repository
- **Cart management** with AsyncStorage persistence
- **Favorites** with AsyncStorage persistence
- **Authentication** (login/register) with server + offline fallback
- **Store locator** - 8 boutiques across Cameroon
- **Checkout flow** - 3 steps: cart → delivery → Mobile Money payment
- **Product detail** screen with add to cart

### Brand Colors
- Primary: `#1565C0` (blue)
- Secondary: `#FF6F00` (orange)
- Background: `#F5F7FA`

### Real Images (GitHub)
- Logo: `https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/logos.png`
- Products: `https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/Photo/...`
- Hero banners: `https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/Photo/Acceuil/a1-a4.jpg`
- Laptops: `https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/main/Photo/Ordinateur/1-24.jpg`

### Authentication
- **Server-side** (when accessible): JWT tokens stored via JSON file (`users.json` in api-server dir)
- **Offline fallback**: LocalStorage (AsyncStorage) when server is inaccessible
- API endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Also mounted at `/api-server/api/...` for Replit proxy routing

### 8 Stores
Yaoundé, Douala, Bafoussam, Bertoua, Maroua, Garoua, Ngaoundéré, Dschang

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`.
- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api` and `/api-server/api`
- Routes: `health.ts` (GET /healthz), `auth.ts` (register/login/me/logout/profile)

### `artifacts/mobile` (`@workspace/mobile`)

KDO Cameroun Expo mobile app.
- `app/(tabs)/` — tab screens
- `app/auth/` — login and register screens
- `context/CartContext.tsx` — cart + favorites with AsyncStorage
- `context/AuthContext.tsx` — auth with server + offline fallback
- `data/products.ts` — 24 products with real images
