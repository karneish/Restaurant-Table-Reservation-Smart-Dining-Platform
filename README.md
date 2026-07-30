<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?logo=springboot" alt="Spring Boot 3.2"/>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL"/>
</p>

<h1 align="center">🎟️ Ticket Booking System</h1>
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
- [Docker Deployment](#docker-deployment)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Monitoring & Observability](#monitoring--observability)
- [Default Credentials](#default-credentials)
- [License](#license)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                     │
│                    http://localhost:3000                       │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP (REST)
┌──────────────────────▼───────────────────────────────────────┐
│              ticket-booking  —  API Gateway                   │
│           (Spring Cloud Gateway — :8080)                      │
│     Circuit Breaker │ Rate Limiter │ Routing │ Tracing        │
└─┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬─────────┘
  │    │    │    │    │    │    │    │    │    │
┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─▼┐ ┌─────▼──────┐
│Au│ │Us│ │Mo│ │Th│ │Sh│ │Bo│ │Pa│ │No│ │  Config    │
│th│ │er│ │vi│ │ea│ │ow│ │ok│ │ym│ │ti│ │  Server    │
│  │ │  │ │e │ │tr│ │  │ │ng│ │en│ │fy│ │  (:8888)   │
│:8│ │:8│ │  │ │e │ │:8│ │  │ │t │ │  │ └────────────┘
│08│ │08│ │:8│ │  │ │08│ │:8│ │  │ │:8│ ┌────────────┐
│1 │ │2 │ │08│ │:8│ │5 │ │08│ │:8│ │08│ │  Service   │
│  │ │  │ │3 │ │08│ │  │ │6 │ │08│ │8 │ │  Registry  │
│  │ │  │ │  │ │4 │ │  │ │  │ │7 │ │  │ │  (:8761)   │
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └────────────┘
  │         │                  │
  └─────────┴──────────────────┴──────────────────────────────┐
                        │                                     │
              ┌─────────▼──────────┐    ┌──────────────────┐  │
              │    PostgreSQL 16    │    │  pgAdmin4        │  │
              │  ticket_booking DB  │    │  http://localhost│  │
              │  :5432              │    │  :5050           │  │
              └────────────────────┘    └──────────────────┘  │
                                                               │
  ┌──────────┐   ┌──────────┐   ┌─────────────────────────────┘
  │  Redis   │   │  Zipkin   │
  │  :6379   │   │  :9411    │
  └──────────┘   └──────────┘
```

All 11 microservices share a **single PostgreSQL database** (`ticket_booking`), managed through pgAdmin4. The API Gateway (`ticket-booking` on port `8080`) serves as the single entry point for all client requests.

---

## 🛠️ Tech Stack

### Backend — 11 Spring Boot Microservices

| Category              | Technology                                |
|-----------------------|-------------------------------------------|
| **Framework**         | Spring Boot 3.2.5, Java 21                |
| **API Gateway**       | Spring Cloud Gateway 2023.0.1             |
| **Service Discovery** | Netflix Eureka                            |
| **Config Management** | Spring Cloud Config Server                |
| **Database**          | PostgreSQL 16 (single shared instance)    |
| **ORM**               | Spring Data JPA / Hibernate               |
| **Auth**              | JWT (jjwt 0.12) — Access + Refresh Tokens |
| **Resilience**        | Resilience4j (Circuit Breaker, Retry, Rate Limiter) |
| **Caching**           | Redis 7                                   |
| **Tracing**           | Micrometer + Zipkin                       |
| **Documentation**     | SpringDoc OpenAPI (Swagger UI)            |
| **Build**             | Maven (multi-module), Docker Compose      |

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

| # | Service             | Port | Container Name          | Responsibility                        |
|---|---------------------|------|-------------------------|---------------------------------------|
| 1 | **service-registry**| 8761 | `ticket-booking-registry` | Eureka server — service discovery     |
| 2 | **config-server**   | 8888 | `ticket-booking-config`   | Centralized config management         |
| 3 | **api-gateway**     | 8080 | `ticket-booking`          | **Main entry point** — routing, filtering, rate limiting |
| 4 | **auth-service**    | 8081 | `ticket-booking-auth`     | Registration, login, JWT, OTP         |
| 5 | **user-service**    | 8082 | `ticket-booking-user`     | User profile management               |
| 6 | **movie-service**   | 8083 | `ticket-booking-movie`    | Movie catalog, search, filters        |
| 7 | **theatre-service** | 8084 | `ticket-booking-theatre`  | Theatres, screens, seat layouts       |
| 8 | **show-service**    | 8085 | `ticket-booking-show`     | Show scheduling & availability        |
| 9 | **booking-service** | 8086 | `ticket-booking-book`     | Booking engine, seat locking, waitlist|
|10 | **payment-service** | 8087 | `ticket-booking-payment`  | Payment processing (mock gateway)     |
|11 | **notification-service** | 8088 | `ticket-booking-notify` | Email/SMS notifications (simulated) |

---

## ✨ Key Features

- **🔒 JWT Authentication** — Access + Refresh tokens with OTP email verification
- **🛡️ Circuit Breaker Pattern** — Resilience4j prevents cascading failures
- **⏱️ Rate Limiting** — Redis-based request throttling per client
- **🔍 Service Discovery** — Dynamic registration via Eureka
- **📊 Distributed Tracing** — End-to-end request tracking with Zipkin
- **💺 Seat Locking** — Pessimistic locking with optimistic versioning to prevent double bookings
- **📋 Waitlist** — Auto-notification when seats become available
- **📧 OTP Verification** — Secure email-based identity verification
- **🖥️ Admin Dashboard** — Manage movies, theatres, screens, and bookings
- **📱 Responsive UI** — Mobile-first design with TailwindCSS
- **🐳 Docker Compose** — One-command deployment of 15 containers
- **🗄️ PostgreSQL + pgAdmin4** — Shared database with web-based management UI
- **⚡ Redis Caching** — In-memory caching for frequently accessed data

---

## 🚀 Quick Start

### Prerequisites

| Tool      | Version | Notes                           |
|-----------|---------|---------------------------------|
| Java      | 21+     | Required for building services  |
| Maven     | 3.9+    | Included via wrapper            |
| Node.js   | 20+     | Required for frontend           |
| Docker    | 24+     | Recommended for full deployment |
| Docker Compose | 2.24+ | Included with Docker Desktop   |

---

## 🐳 Docker Deployment (Recommended)

The entire system runs in **15 containers** orchestrated via Docker Compose.

```bash
# 1. Build all Spring Boot services
cd services
mvn clean package -DskipTests -T 4

# 2. Return to root and start everything
cd ..
docker compose up --build -d

# 3. Verify all containers are running
docker compose ps
```

### Services & Ports

| Service           | URL                                | Credentials                         |
|-------------------|------------------------------------|-------------------------------------|
| **Frontend**      | http://localhost:3000               | —                                   |
| **API Gateway**   | http://localhost:8080               | —                                   |
| **Eureka**        | http://localhost:8761               | —                                   |
| **pgAdmin4**      | http://localhost:5050               | `admin@ticketbooking.com` / `root123` |
| **Zipkin**        | http://localhost:9411               | —                                   |
| **PostgreSQL**    | localhost:5432                      | `ticket_user` / `root123` / `ticket_booking` |

### Docker Compose Architecture

```yaml
# Key highlights from docker-compose.yml:
services:
  postgres:       # PostgreSQL 16 — single database for all services
  pgadmin:        # pgAdmin4 — database management UI
  service-registry: # Eureka — service discovery
  config-server:  # Spring Cloud Config — centralized configuration
  ticket-booking: # API Gateway — main entry point (container name)
  auth-service:   # Auth & JWT management
  user-service:   # User profiles
  movie-service:  # Movie catalog
  theatre-service:# Theatres & screens
  show-service:   # Show scheduling
  booking-service:# Booking engine (depends on Redis)
  payment-service:# Payment processing
  notification-service: # Email/SMS notifications
  frontend:       # React + Vite SPA
  redis:          # Caching & rate limiting
  zipkin:         # Distributed tracing
```

---

## 💻 Running Locally (Development)

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, Zipkin via Docker
docker compose up -d postgres redis zipkin pgadmin

# Build and start the shared library first
cd services
mvn clean install -pl common -DskipTests

# Start Service Registry
mvn spring-boot:run -pl service-registry

# Start Config Server (in new terminal)
mvn spring-boot:run -pl config-server

# Start API Gateway
mvn spring-boot:run -pl api-gateway
```

### 2. Start Business Services

Open separate terminals for each:

```bash
cd services
for svc in auth-service user-service movie-service theatre-service show-service booking-service payment-service notification-service; do
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

### Movies — `/api/movies/*`

| Method | Endpoint                         | Description              | Auth Required |
|--------|----------------------------------|--------------------------|---------------|
| GET    | `/api/movies`                    | List all movies          | ❌            |
| GET    | `/api/movies/active`             | List currently active    | ❌            |
| GET    | `/api/movies/{id}`               | Get movie details        | ❌            |
| GET    | `/api/movies/search?q=`         | Search movies by title   | ❌            |
| GET    | `/api/movies/language/{lang}`    | Filter by language       | ❌            |
| GET    | `/api/movies/genre/{genre}`      | Filter by genre          | ❌            |
| POST   | `/api/movies`                    | Create movie             | ✅ (Admin)    |
| PUT    | `/api/movies/{id}`               | Update movie             | ✅ (Admin)    |
| DELETE | `/api/movies/{id}`               | Delete movie             | ✅ (Admin)    |

### Theatres — `/api/theatres/*`

| Method | Endpoint                              | Description              | Auth Required |
|--------|---------------------------------------|--------------------------|---------------|
| GET    | `/api/theatres`                       | List all theatres        | ❌            |
| GET    | `/api/theatres/active`                | List active theatres     | ❌            |
| GET    | `/api/theatres/city/{city}`           | Filter by city           | ❌            |
| GET    | `/api/theatres/{id}`                  | Get theatre details      | ❌            |
| GET    | `/api/theatres/{id}/screens`          | Get screens in theatre   | ❌            |
| GET    | `/api/theatres/screens/{id}/seats`    | Get seats in screen      | ❌            |

### Shows — `/api/shows/*`

| Method | Endpoint                               | Description              | Auth Required |
|--------|----------------------------------------|--------------------------|---------------|
| GET    | `/api/shows/search?movieId=&date=`     | Search shows             | ❌            |
| GET    | `/api/shows/movie/{movieId}`           | Shows by movie           | ❌            |
| GET    | `/api/shows/theatre/{theatreId}`       | Shows by theatre         | ❌            |
| GET    | `/api/shows/{id}`                      | Get show details         | ❌            |
| POST   | `/api/shows`                           | Create show              | ✅ (Admin)    |
| PUT    | `/api/shows/{id}`                      | Update show              | ✅ (Admin)    |

### Bookings — `/api/bookings/*`

| Method | Endpoint                           | Description              | Auth Required |
|--------|------------------------------------|--------------------------|---------------|
| POST   | `/api/bookings`                    | Create a new booking     | ✅            |
| POST   | `/api/bookings/{id}/pay`          | Confirm payment          | ✅            |
| POST   | `/api/bookings/{id}/cancel`       | Cancel booking           | ✅            |
| GET    | `/api/bookings/{id}`               | Get booking by ID        | ✅            |
| GET    | `/api/bookings/user`               | Get user's bookings      | ✅            |
| POST   | `/api/bookings/waitlist`           | Join waitlist            | ✅            |

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
│   ├── movie-service/                     # 🎬 Movie catalog & search
│   ├── theatre-service/                   # 🏛️ Theatre, screen & seat management
│   ├── show-service/                      # 📅 Show scheduling & availability
│   ├── booking-service/                   # 🎫 Booking engine, seat locking, waitlist
│   ├── payment-service/                   # 💳 Payment processing (mock)
│   └── notification-service/              # 📧 Email/SMS notifications
│
├── frontend/                              # 🌐 React + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/                    # Reusable UI components
│   │   │   ├── layout/                    # Layout components (Navbar, Footer)
│   │   │   ├── common/                    # Shared components (Loader, Modal, etc.)
│   │   │   └── booking/                   # Booking-specific components
│   │   ├── pages/                         # Page-level components
│   │   │   ├── Home.tsx                   # Landing page with featured movies
│   │   │   ├── Movies.tsx                 # Movie listing & search
│   │   │   ├── MovieDetail.tsx            # Movie details & show selection
│   │   │   ├── SeatSelection.tsx          # Interactive seat map
│   │   │   ├── BookingConfirmation.tsx    # Booking summary & payment
│   │   │   ├── MyBookings.tsx             # User booking history
│   │   │   ├── AdminDashboard.tsx         # Admin management panel
│   │   │   └── Auth.tsx                   # Login / Register
│   │   ├── services/                      # Axios API client & interceptors
│   │   ├── context/                       # React Context (Auth, Booking)
│   │   │   └── AuthContext.tsx            # JWT token management
│   │   └── types/                         # TypeScript interfaces & enums
│   ├── nginx.conf                         # Nginx config (proxies to ticket-booking:8080)
│   └── Dockerfile                         # Multi-stage build (node → nginx)
│
├── config/                                # 🛠️ Infrastructure configuration
│   └── pgadmin-servers.json               # Auto-register PostgreSQL in pgAdmin4
│
├── scripts/                               # 📜 Build & deployment scripts
│   ├── build-all.ps1                      # Build all services + frontend
│   └── run-all.ps1                        # Start all services locally
│
├── docker-compose.yml                     # 🐳 15-container orchestration
├── .gitignore
└── README.md
```

---

## 📊 Monitoring & Observability

| Tool              | URL                              | Purpose                        |
|-------------------|----------------------------------|--------------------------------|
| **Eureka**        | http://localhost:8761             | Service health & registration  |
| **Zipkin**        | http://localhost:9411             | Distributed request tracing    |
| **pgAdmin4**      | http://localhost:5050             | Database management UI         |
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

## 🐳 Docker Reference

### Container Names

All containers follow the `ticket-booking-*` naming convention:

| Container Name           | Service               |
|--------------------------|-----------------------|
| `ticket-booking-db`      | PostgreSQL 16         |
| `ticket-booking-pgadmin` | pgAdmin4              |
| `ticket-booking`         | API Gateway (main)    |
| `ticket-booking-registry`| Service Registry      |
| `ticket-booking-config`  | Config Server         |
| `ticket-booking-auth`    | Auth Service          |
| `ticket-booking-user`    | User Service          |
| `ticket-booking-movie`   | Movie Service         |
| `ticket-booking-theatre` | Theatre Service       |
| `ticket-booking-show`    | Show Service          |
| `ticket-booking-book`    | Booking Service       |
| `ticket-booking-payment` | Payment Service       |
| `ticket-booking-notify`  | Notification Service  |
| `ticket-booking-ui`      | Frontend (nginx)      |
| `ticket-booking-redis`   | Redis                 |
| `ticket-booking-zipkin`  | Zipkin                |

### Useful Docker Commands

```bash
# View all running containers
docker compose ps

# View logs for a specific service
docker compose logs -f ticket-booking

# Rebuild a single service
docker compose up -d --build auth-service

# Stop everything and clean volumes
docker compose down -v

# Execute PostgreSQL commands
docker compose exec postgres psql -U ticket_user -d ticket_booking
```

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Spring Boot, React, and Docker
</p>
