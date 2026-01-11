# ACT9 — Mini E-Commerce (NestJS + React)

Full-stack mini e-commerce app:

- **Backend**: NestJS + TypeORM + SQLite + JWT auth + Swagger
- **Frontend**: React + TypeScript + Vite

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

## Quick start (local)

Open two terminals.

### 1) Backend (API)

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on `http://localhost:3000` by default.

- Swagger UI: `http://localhost:3000/api`
- Uploaded images: `http://localhost:3000/uploads/...`

### 2) Frontend (Web)

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local URL in the terminal (usually `http://localhost:5173`).

## Configuration

### Backend port

The backend listens on `3000` by default and can be changed via `PORT`:

PowerShell example:

```powershell
$env:PORT=3001
npm run start:dev
```

### Frontend API base URL

The frontend is currently configured to call the backend at:

- `http://localhost:3000`

If you change the backend port, update the constant in:

- `frontend/src/api/client.ts`

## What’s included

### Authentication

- `POST /auth/register` — create an account
- `POST /auth/login` — returns a JWT (stored in `localStorage` by the frontend)

### Users

- `GET /users/check/:username` — check username availability
- `GET /users`, `GET /users/:id`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`

### Products

- `GET /products` — list products
- `GET /products/:id` — get product
- `POST /products` — create product (**SELLER** role, `multipart/form-data` with optional `image`)
- `PATCH /products/:id` — update product (**SELLER** role, `multipart/form-data`)
- `DELETE /products/:id` — delete product (**SELLER** role)

Image upload notes:

- Field name is `image`
- Images are saved to `backend/uploads/` and served at `/uploads/...`

### Cart (JWT required)

- `GET /cart` — current cart
- `POST /cart` — add item
- `PATCH /cart/:itemId` — update quantity
- `DELETE /cart/:itemId` — remove item

### Orders (JWT required)

- `POST /orders/checkout` — convert cart into an order
- `GET /orders` — list your orders

## Data storage

- SQLite database file: `backend/database.sqlite`
- TypeORM `synchronize` is enabled (tables auto-create on start)

To reset local data, stop the backend and delete `backend/database.sqlite`.

## Useful scripts

### Backend

From `backend/`:

- `npm run start:dev` — dev server (watch)
- `npm run build` — production build
- `npm run start:prod` — run compiled output
- `npm run test` — unit tests

### Frontend

From `frontend/`:

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Project structure

```text
backend/   NestJS API (auth, users, products, cart, orders)
frontend/  React app (pages: Login/Register/Products/Cart/Orders)
```
