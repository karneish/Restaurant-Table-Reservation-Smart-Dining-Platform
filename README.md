<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?logo=springboot" alt="Spring Boot 3.2"/>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql" alt="PostgreSQL"/>
</p>

<h1 align="center">🍽️ TableHub — Restaurant Reservation System</h1>
<p align="center">
  <strong>Enterprise-Grade Microservices Architecture — 11 Spring Boot Services + React Frontend</strong>
</p>

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Microservices Breakdown](#microservices-breakdown)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Running Without Docker](#running-without-docker)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Monitoring & Observability](#monitoring--observability)
- [Default Credentials](#default-credentials)
- [License](#license)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                Client (React + Vite)                          │
│               http://localhost:3000                           │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP (REST)
┌──────────────────────▼───────────────────────────────────────┐
│              ticket-booking  —  API Gateway                   │
│           (Spring Cloud Gateway — :8080)                      │
│          Circuit Breaker │ Routing │ JWT Filtering            │
└─┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬─────────┘
  │    │    │    │    │    │    │    │    │    │
┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─────▼──────┐
│Au│ │Us│ │Re│ │Ta│ │Sl│ │Re│ │Pa│ │No│ │  │ │  Config    │
│th│ │er│ │st│ │bl│ │ot│ │se│ │ym│ │ti│ │  │ │  Server    │
│  │ │  │ │au│ │e │ │  │ │rv│ │en│ │fy│ │  │ │  (:8888)   │
│:8│ │:8│ │ra│ │:8│ │:8│ │at│ │t │ │  │ │  │ └────────────┘
│08│ │08│ │nt│ │08│ │08│ │io│ │:8│ │:8│ │  │ ┌────────────┐
│1 │ │2 │ │  │ │4 │ │5 │ │n │ │08│ │08│ │  │ │  Service   │
│  │ │  │ │:8│ │  │ │  │ │:8│ │7 │ │8 │ │  │ │  Registry  │
│  │ │  │ │08│ │  │ │  │ │06│ │  │ │  │ │  │ │  (:8761)   │
│  │ │  │ │3 │ │  │ │  │ │  │ │  │ │  │ │  │ └────────────┘
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
                        │
            ┌───────────▼───────────┐
            │   PostgreSQL 16 DB    │
            │  (Docker Compose /    │
            │   Neon on the cloud)  │
            └───────────────────────┘
```

All 11 microservices share a **single PostgreSQL 16 database** (`ticket_booking_system_db`). Locally it runs via Docker Compose; in the cloud it uses a shared Neon PostgreSQL instance. The API Gateway (`ticket-booking` on port `8080`) is the single entry point for all client requests.

---

## 🛠️ Tech Stack

### Backend — 11 Spring Boot Microservices

| Category              | Technology                                |
|-----------------------|-------------------------------------------|
| **Framework**         | Spring Boot 3.2.5, Java 21                |
| **API Gateway**       | Spring Cloud Gateway 2023.0.1             |
| **Service Discovery** | Netflix Eureka                            |
| **Config Management** | Spring Cloud Config Server                |
| **Database**          | PostgreSQL 16 (shared; Neon on cloud) |
| **ORM**               | Spring Data JPA / Hibernate               |
| **Auth**              | JWT (jjwt 0.12) — Access + Refresh Tokens |
| **Resilience**        | Resilience4j (Circuit Breaker, Retry)     |
| **Documentation**     | SpringDoc OpenAPI (Swagger UI)            |
| **Build**             | Maven (multi-module), PowerShell scripts  |

### Frontend

| Technology          | Usage                    |
|---------------------|--------------------------|
| **React 18**        | UI framework             |
| **TypeScript 5.5**  | Type safety              |
| **Vite**            | Build tool & dev server  |
| **TailwindCSS**     | Utility-first styling    |
| **React Router v6** | Client-side routing      |
| **Axios**           | HTTP client              |
| **React Hot Toast** | Toast notifications      |
| **Lucide React**    | Icon library             |

---

## 📦 Microservices Breakdown

| # | Service             | Port | Responsibility                        |
|---|---------------------|------|---------------------------------------|
| 1 | **service-registry**| 8761 | Eureka server — service discovery     |
| 2 | **config-server**   | 8888 | Centralized config management         |
| 3 | **api-gateway**     | 8080 | **Main entry point** — routing, JWT filtering |
| 4 | **auth-service**    | 8081 | Registration, login, JWT, OTP         |
| 5 | **user-service**    | 8082 | User profile management               |
| 6 | **restaurant-service** | 8083 | Restaurant catalog, cuisine, menus    |
| 7 | **table-service**   | 8084 | Dining areas, table layouts, cleaning |
| 8 | **slot-service**    | 8085 | Time-slot scheduling & availability   |
| 9 | **reservation-service** | 8086 | Reservation engine, HOLD locking, waitlist, pre-order |
|10 | **payment-service** | 8087 | Payment processing (mock gateway)     |
|11 | **notification-service** | 8088 | Email/SMS notifications (simulated) |

---

## ✨ Key Features

- **🔒 JWT Authentication** — Access + Refresh tokens with OTP email verification
- **🛡️ Circuit Breaker Pattern** — Resilience4j prevents cascading failures
- **🔍 Service Discovery** — Dynamic registration via Eureka
- **🍽️ Table Reservation** — HOLD slot locking with expiry prevents double-booking
- **🪑 Smart Table Matching** — Match tables by party size, zone, accessibility, and quiet-area preferences
- **📋 Pre-Order** — Order from the menu in advance, managed by staff (DRAFT → PLACED → IN_PREP → SERVED)
- **💵 Deposit Payment** — Pay a deposit to confirm reservations
- **🧹 Cleaning Management** — Track table cleaning status (READY / DIRTY) with audit log
- **📋 Waitlist** — Auto-notification when a slot becomes available
- **🖥️ Admin Dashboard** — Manage restaurants, menus, dining areas, tables, slots, and reservations
- **📱 Responsive UI** — Mobile-first design with TailwindCSS
- **🚀 Docker + PostgreSQL** — Full 12-container stack via Docker Compose; zero-config local start

---

## 🚀 Quick Start

### Prerequisites

| Tool    | Version | Notes                                  |
|---------|---------|----------------------------------------|
| Java    | 21+     | Required for building services         |
| Maven   | 3.9+    | Required for building services         |
| Node.js | 20+     | Required for frontend                  |

Docker Desktop (with Docker Compose) is required for the all-in-one local stack — PostgreSQL 18 + pgAdmin4 + all 11 services + frontend.

### Step 1 — Build Everything (one-time)

```powershell
# From the project root
scripts\build-all.ps1
```

This runs `mvn clean install -DskipTests` for all backend services and then builds the frontend.

### Step 2 — Start All Services

```powershell
scripts\run-all.ps1
```

The script starts PostgreSQL + pgAdmin4 → Service Registry → Config Server → API Gateway → all 8 business services → frontend as Docker containers.

### Step 3 — Open the App

- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:8080
- **Service Registry:** http://localhost:8761
- **pgAdmin4:** http://localhost:5050

---

## 🏠 Running with Docker Compose (Recommended)

The full stack runs with **Docker Compose** — PostgreSQL 18 + pgAdmin4 + all 11 services + the Nginx-served frontend. No manual database setup is required.

### One-Command Start

```powershell
scripts\build-all.ps1   # optional: Maven build + frontend build (Docker does its own build)
scripts\run-all.ps1
```

`run-all.ps1` runs `docker compose up --build -d`, which starts:

1. **PostgreSQL 18** (`ticket_booking_system_db`) + **pgAdmin4** (:5050)
2. **service-registry** (:8761), **config-server** (:8888), **api-gateway** (:8080)
3. **auth-service** (:8081), **user-service** (:8082), **restaurant-service** (:8083), **table-service** (:8084), **slot-service** (:8085), **reservation-service** (:8086), **payment-service** (:8087), **notification-service** (:8088)
4. **frontend** (:3000) — built by Nginx

### URLs

| Service           | URL                               |
|-------------------|-----------------------------------|
| **Frontend**      | http://localhost:3000             |
| **API Gateway**   | http://localhost:8080             |
| **Eureka**        | http://localhost:8761             |
| **pgAdmin4**      | http://localhost:5050             |
| **PostgreSQL 18** | localhost:5432 (`ticket_user` / `root123`) |

### Resetting the Data

```powershell
docker compose down -v
```

The next start re-creates the schema and re-seeds demo data.

### Running Without Docker (Bare Metal)

Each service reads `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` from the environment (defaults point at a Neon PostgreSQL instance). Set those variables to a reachable PostgreSQL database, then start each service with `mvn spring-boot:run -pl <service>` from `services/` and the frontend with `npm run dev` from `frontend/` (Vite proxies `/api` to `localhost:8080`).

---

## ☁️ Cloud Deployment (Render + Neon + Vercel)

The `render.yaml` Blueprint at the repo root deploys **all 11 microservices** to Render as free web services, backed by a shared **Neon PostgreSQL** database. The React frontend is deployed to **Vercel**, which proxies `/api/*` to the gateway.

### Backend — Render Blueprint

1. Push the repo (including `render.yaml`) to GitHub/GitLab.
2. In the [Render Dashboard](https://dashboard.render.com), click **New → Blueprint**, pick the repo, and confirm.
3. During creation, Render prompts for `SPRING_DATASOURCE_PASSWORD` — enter your **Neon PostgreSQL password** for each service that needs it (auth, user, restaurant, table, slot, reservation, payment).
4. Deploy. Each service gets a URL: `https://tablehub-<name>.onrender.com`.

Deployed services and URLs:

| Service | URL |
|---------|-----|
| API Gateway (entry point) | https://tablehub-gateway.onrender.com |
| Service Registry | https://tablehub-registry.onrender.com |
| Config Server | https://tablehub-config.onrender.com |
| Auth / User | https://tablehub-auth.onrender.com / https://tablehub-user.onrender.com |
| Restaurant / Table / Slot | https://tablehub-restaurant.onrender.com / `-table` / `-slot` |
| Reservation / Payment / Notification | https://tablehub-reservation.onrender.com / `-payment` / `-notification` |

Notes:

- **Service-to-service wiring** uses each service's public hostname, resolved automatically via Render's `RENDER_EXTERNAL_HOSTNAME` variable (WebClient clients in reservation/slot services read `TABLE_SERVICE_URL`, `SLOT_SERVICE_URL`, `RESTAURANT_SERVICE_URL`). The gateway routes are set in `services/api-gateway/src/main/resources/application.yml` (overridable via env vars).
- **JWT secret** is auto-generated (`APP_JWT_SECRET`) on first deploy.
- **Free tier spins down** idle instances (cold start ~30s on first request). Paid plans (`starter`+) keep them warm.
- `healthCheckPath` is `/actuator/health` for every service.

### Database — Neon PostgreSQL

All services share one Neon database (defaults already in each `application.yml`). Set the connection via the `tablehub-db` environment group in `render.yaml`.

### Frontend — Vercel

1. Import the `frontend/` folder (or the whole repo with root `frontend/`) into a new Vercel project. Vercel auto-detects **Vite** — build command `npm run build`, output `dist`.
2. `frontend/vercel.json` rewrites `/api/*` to `https://tablehub-gateway.onrender.com/api/*` and falls back to `index.html` for client-side routing.
3. If your Vercel project name is **not** `tablehub-<something>`, update `CORS_ALLOWED_ORIGIN_PATTERNS` on the `tablehub-gateway` service in Render so the browser origin is allowed.

### Verifying

```bash
# Health of the gateway
curl https://tablehub-gateway.onrender.com/actuator/health

# Login through the gateway (all service URLs must be live)
curl -X POST https://tablehub-gateway.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ticketbooking.com","password":"admin123"}'
```

---

## 💻 Running Locally (Development)

### 1. Build & Install

```bash
cd services
mvn clean install -DskipTests
```

### 2. Start Service Registry (first)

```bash
mvn spring-boot:run -pl service-registry
```

Wait ~15 seconds for Eureka to come up, then start the API Gateway:

```bash
mvn spring-boot:run -pl api-gateway
```

### 2. Start Business Services

Open separate terminals for each:

```bash
cd services
for svc in auth-service user-service restaurant-service table-service slot-service reservation-service payment-service notification-service; do
  mvn spring-boot:run -pl $svc
done
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

---

## 📡 API Endpoints

All endpoints are proxied through the API Gateway at `http://localhost:8080`.

### Authentication — `/api/auth/*`

| Method | Endpoint              | Description            | Auth Required |
|--------|-----------------------|------------------------|---------------|
| POST   | `/api/auth/register`  | Register new user      | ❌            |
| POST   | `/api/auth/login`     | Login, get JWT tokens  | ❌            |
| POST   | `/api/auth/refresh`   | Refresh access token   | ❌            |
| POST   | `/api/auth/send-otp`  | Send OTP email         | ✅            |
| POST   | `/api/auth/verify-otp`| Verify OTP code        | ✅            |

### Users — `/api/users/*`

| Method | Endpoint               | Description              | Auth Required |
|--------|------------------------|--------------------------|---------------|
| GET    | `/api/users/profile`   | Get current user profile | ✅            |
| PUT    | `/api/users/profile`   | Update user profile      | ✅            |
| GET    | `/api/users/{id}`      | Get user by ID (admin)   | ✅ (Admin)    |
| GET    | `/api/users`           | List all users (admin)   | ✅ (Admin)    |

### Restaurants — `/api/restaurants/*`

| Method | Endpoint                          | Description                  | Auth Required |
|--------|-----------------------------------|------------------------------|---------------|
| GET    | `/api/restaurants`                | List all restaurants         | ❌            |
| GET    | `/api/restaurants/active`         | List active restaurants      | ❌            |
| GET    | `/api/restaurants/{id}`           | Get restaurant details       | ❌            |
| GET    | `/api/restaurants/search?q=`      | Search restaurants           | ❌            |
| GET    | `/api/restaurants/cuisine/{cuisine}` | Filter by cuisine          | ❌            |
| GET    | `/api/restaurants/city/{city}`    | Filter by city               | ❌            |
| GET    | `/api/restaurants/{id}/menu`      | Get restaurant menu          | ❌            |
| POST   | `/api/restaurants`                | Create restaurant            | ✅ (Admin)    |
| PUT    | `/api/restaurants/{id}`           | Update restaurant            | ✅ (Admin)    |
| DELETE | `/api/restaurants/{id}`           | Delete restaurant            | ✅ (Admin)    |
| POST   | `/api/restaurants/{id}/menu`      | Add menu item                | ✅ (Admin)    |
| PUT    | `/api/restaurants/{id}/menu/{itemId}` | Update menu item         | ✅ (Admin)    |
| DELETE | `/api/restaurants/{id}/menu/{itemId}` | Delete menu item         | ✅ (Admin)    |

### Dining Areas & Tables — `/api/*`

| Method | Endpoint                                        | Description              | Auth Required |
|--------|-------------------------------------------------|--------------------------|---------------|
| GET    | `/api/restaurants/{restaurantId}/areas`         | List dining areas        | ❌            |
| POST   | `/api/restaurants/{restaurantId}/areas`         | Create dining area       | ✅ (Admin)    |
| GET    | `/api/areas/{areaId}/tables`                    | List tables in an area   | ❌            |
| POST   | `/api/areas/{areaId}/tables`                    | Create table             | ✅ (Admin)    |
| GET    | `/api/tables/{id}`                              | Get table details        | ❌            |
| GET    | `/api/tables/match?restaurantId=&partySize=&zone=&accessible=&quiet=` | Find matching tables | ❌ |
| PUT    | `/api/tables/{id}/cleaning`                     | Update cleaning status   | ✅ (Admin)    |
| GET    | `/api/tables/{id}/cleaning-log`                 | Cleaning audit log       | ✅ (Admin)    |

### Slots — `/api/slots/*`

| Method | Endpoint                                        | Description              | Auth Required |
|--------|-------------------------------------------------|--------------------------|---------------|
| GET    | `/api/slots`                                    | List all slots           | ❌            |
| GET    | `/api/slots/{id}`                               | Get slot details         | ❌            |
| GET    | `/api/slots/availability?restaurantId=&date=&partySize=` | Check availability | ❌            |
| GET    | `/api/slots/restaurant/{restaurantId}/date?date=` | Slots for a date       | ❌            |
| POST   | `/api/slots`                                    | Create slot              | ✅ (Admin)    |
| DELETE | `/api/slots/{id}`                               | Delete slot              | ✅ (Admin)    |

### Reservations — `/api/reservations/*`

| Method | Endpoint                                    | Description               | Auth Required |
|--------|---------------------------------------------|---------------------------|---------------|
| POST   | `/api/reservations` (header `X-User-Email`) | Create a reservation (HOLD) | ✅            |
| POST   | `/api/reservations/{id}/pay`                | Pay deposit / confirm     | ✅            |
| POST   | `/api/reservations/{id}/cancel`             | Cancel reservation        | ✅            |
| GET    | `/api/reservations/{id}`                    | Get reservation by ID     | ✅            |
| GET    | `/api/reservations/reservation/{reservationId}` | Get by reservation ref | ✅            |
| GET    | `/api/reservations/user` (header `X-User-Email`) | Get user's reservations | ✅            |
| PUT    | `/api/reservations/{id}/status`             | Update reservation status | ✅ (Admin)    |
| POST   | `/api/reservations/{id}/preorder`           | Place a pre-order         | ✅            |
| PUT    | `/api/reservations/preorders/{preOrderId}/status` | Update pre-order status | ✅ (Admin) |
| POST   | `/api/reservations/waitlist`                | Join waitlist             | ✅            |
| GET    | `/api/reservations/waitlist/user`           | Get user's waitlist entries | ✅          |

### Payments — `/api/payments/*`

| Method | Endpoint                    | Description              | Auth Required |
|--------|-----------------------------|--------------------------|---------------|
| POST   | `/api/payments/process`     | Process payment          | ✅            |
| GET    | `/api/payments/{id}`        | Get payment status       | ✅            |
| POST   | `/api/payments/{id}/refund` | Refund payment           | ✅ (Admin)    |

### Notifications — `/api/notifications/*`

| Method | Endpoint                         | Description              | Auth Required |
|--------|----------------------------------|--------------------------|---------------|
| GET    | `/api/notifications`             | Get user notifications   | ✅            |
| PUT    | `/api/notifications/{id}/read`   | Mark as read             | ✅            |

---

## 📁 Project Structure

```
ticket-booking-system/
│
├── services/                              # 📦 Multi-module Maven project (parent POM)
│   ├── pom.xml                            # Parent POM — dependency & module management
│   ├── common/                            # 🔗 Shared library (DTOs, exceptions, constants)
│   ├── service-registry/                  # 🔍 Eureka Discovery Server
│   ├── config-server/                     # ⚙️ Spring Cloud Config Server
│   │   └── src/main/resources/config-repo/# Externalized config files
│   ├── api-gateway/                       # 🚪 Spring Cloud Gateway (entry point)
│   ├── auth-service/                      # 🔐 Authentication & JWT
│   ├── user-service/                      # 👤 User profile management
│   ├── restaurant-service/                # 🍽️ Restaurant catalog & menu management
│   ├── table-service/                     # 🪑 Dining areas, table & cleaning management
│   ├── slot-service/                      # 📅 Time-slot scheduling & availability
│   ├── reservation-service/               # 📋 Reservation engine, HOLD locking, pre-order, waitlist
│   ├── payment-service/                   # 💳 Payment processing (mock)
│   └── notification-service/              # 📧 Email/SMS notifications
│
├── frontend/                              # 🌐 React + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/                    # Reusable UI components
│   │   │   ├── Navbar.tsx                 # Top navigation (TableHub branding)
│   │   │   └── RestaurantCard.tsx         # Restaurant card component
│   │   ├── pages/                         # Page-level components
│   │   │   ├── HomePage.tsx               # Landing page with trending restaurants
│   │   │   ├── RestaurantsPage.tsx        # Restaurant listing, search & filters
│   │   │   ├── RestaurantDetailPage.tsx   # Restaurant details, menu & booking
│   │   │   ├── ReservationPage.tsx        # Booking wizard (date → party size → slot → pre-order → pay)
│   │   │   ├── MyReservationsPage.tsx     # User reservation history
│   │   │   ├── ReservationDetailPage.tsx  # Reservation summary, pay & cancel
│   │   │   ├── AdminDashboard.tsx         # Admin management panel (tabs)
│   │   │   ├── LoginPage.tsx              # Login
│   │   │   └── RegisterPage.tsx           # Registration
│   │   ├── services/                      # Axios API client (api.ts)
│   │   ├── context/                       # React Context (Auth)
│   │   │   └── AuthContext.tsx            # JWT token management
│   │   └── types/                         # TypeScript interfaces & enums
│
├── scripts/                               # 📜 Build & run scripts
│   ├── build-all.ps1                      # Build all services + frontend
│   └── run-all.ps1                        # Start all services (no Docker)
│
├── .gitignore
└── README.md
```

> The `services/` folder is a multi-module Maven project. The database schema is created by `spring.jpa.hibernate.ddl-auto: update` and demo data is auto-seeded on first start.

---

## 📊 Monitoring & Observability

| Tool              | URL                              | Purpose                        |
|-------------------|----------------------------------|--------------------------------|
| **Eureka**        | http://localhost:8761             | Service health & registration  |
| **Actuator**      | http://localhost:8080/actuator/health | Service health endpoint   |
| **Swagger UI**    | http://localhost:{port}/swagger-ui.html | Per-service API docs |

### Health Checks

```bash
# Check individual service health
curl http://localhost:8080/actuator/health
curl http://localhost:8761/actuator/health
curl http://localhost:8888/actuator/health
```

---

## 🔑 Default Credentials

| Role     | Email                     | Password   |
|----------|---------------------------|------------|
| Admin    | admin@ticketbooking.com   | admin123   |
| Customer | john@example.com          | pass123    |

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Spring Boot, React, and PostgreSQL
</p>