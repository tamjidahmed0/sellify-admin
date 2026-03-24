# Sellify Admin Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**A production-grade e-commerce admin dashboard built with React + Vite and NestJS.**
Manage products, orders, reviews, hero slides and analytics — all in one place.

</div>

---

## Related Repositories

This project is part of the Sellify ecosystem. All three repositories work together.

| Repository | Description | Link |
|------------|-------------|------|
| **sellify-server** | NestJS backend — shared by both frontend apps | [sellify-server](https://github.com/tamjidahmed0/sellify-server) |
| **sellify** | Main e-commerce storefront (Next.js) | [sellify](https://github.com/tamjidahmed0/sellify) |

---

## Screenshots

![Dashboard Page](screenshots/dashboard.png)

![order Page](screenshots/order.png)

![review Page](screenshots/review.png)

---

## Features

- **Dashboard** — Revenue, orders, cancelled stats with time-series charts and category breakdown
- **Products** — Full CRUD with image upload (thumbnail + gallery), categories, stock management
- **Categories** — Create, edit, delete with Cloudinary image support
- **Orders** — Filter by status/date/search, inline status update, detail page with timeline
- **Hero Slides** — Manage homepage carousel slides with image upload
- **Reviews** — View and moderate product reviews with rating distribution
- **Auth** — JWT-based admin authentication with route protection

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18+
- **pnpm** / **npm** / **yarn**
- **PostgreSQL** running locally or a cloud instance
- A **Cloudinary** account

---

### 1. Clone the repository

```bash
git clone https://github.com/tamjidahmed0/sellify-admin.git
cd sellify-admin
```

---

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:4000
```

---

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

### 5. Build for production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Backend Setup

The backend is in a separate repository. Follow the setup instructions there:

[sellify-server](https://github.com/tamjidahmed0/sellify-server)

---

## Tech Stack

### Frontend

| Tech | Purpose |
|------|---------|
| React 19 + Vite | UI framework & bundler |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Ant Design | UI components |
| TanStack Query | Server state management |
| React Router v7 | Routing |
| Recharts | Charts & analytics |

### Backend

| Tech | Purpose |
|------|---------|
| NestJS | Backend framework |
| Prisma | ORM |
| PostgreSQL | Database |
| JWT + Passport | Authentication |
| Stripe | Payment processing |
| Cloudinary | Image storage |



## Auth Flow

```
Admin logs in → POST /auth/login
  → JWT token stored in Cookie (2hr expiry)
  → ProtectedRoute verifies token on every load
  → Token expired → redirect to /login
```

---

