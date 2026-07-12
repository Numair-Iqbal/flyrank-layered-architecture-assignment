# FlyRank Layered Architecture — BE-04: Docker + PostgreSQL

A demonstration of clean layered architecture (Route → Service → Repository) proven through a real storage swap: from an in-memory store to a persistent PostgreSQL database, fully containerized with Docker.

---

## 🏗️ Architecture Overview

This project follows a strict **Route → Service → Repository** pattern:

```
Route (API Handler)
   │
   ▼
Service (Business Logic)
   │
   ▼
Repository (Data Access) ──► In-Memory Store  OR  PostgreSQL
```

**The core principle proven in this task:** swapping the storage layer required changing **exactly one line** — a single import statement in `content.service.ts`. No changes were made to routes, services, or business logic.

```ts
// Before
import { ContentRepository } from "./content.repository";

// After
import { ContentPostgresRepository as ContentRepository } from "./content.postgres.repository";
```

---

## 🐳 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| ORM/Driver | `pg` (node-postgres) |

---

## 📦 What's Included

- ✅ PostgreSQL running in Docker with a **named volume** for data persistence
- ✅ Full stack (app + database) starts with a **single command**
- ✅ Connection string managed via `.env.local` (gitignored, `.env.example` committed)
- ✅ `ContentPostgresRepository` implementing the same interface as the in-memory repository
- ✅ SQL init script that auto-creates the schema on first run
- ✅ Verified persistence across a full container + app restart

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Node.js 20+ and npm

### 1. Clone the repository
```bash
git clone https://github.com/Numair-Iqbal/flyrank-layered-architecture-assignment.git
cd flyrank-layered-architecture-assignment
```

### 2. Set up environment variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env.local
```

Required variables:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flyrank_db
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the full stack
```bash
docker compose up
```

This single command:
- Pulls and starts a **PostgreSQL 16** container with a persistent volume
- Automatically runs `init.sql` on first boot to create the `posts` table
- Builds and starts the **Next.js app** container
- App becomes available at → `http://localhost:3000`

---

## 🗄️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## ✅ Persistence Verification

Persistence was tested and confirmed using the following process:

1. **Insert a test row directly into the running Postgres container:**
   ```bash
   docker exec -it flyrank-layered-architecture-assignment-postgres-1 \
     psql -U postgres -d flyrank_db \
     -c "INSERT INTO posts (title, content) VALUES ('Persistence Test', 'Verifying data survives a restart') RETURNING id, title;"
   ```

2. **Stop and remove the containers (without touching the volume):**
   ```bash
   docker compose down
   ```

3. **Restart the full stack:**
   ```bash
   docker compose up
   ```

4. **Confirm the row is still present:**
   ```bash
   docker exec -it flyrank-layered-architecture-assignment-postgres-1 \
     psql -U postgres -d flyrank_db -c "SELECT * FROM posts;"
   ```

**Result:** ✔️ The test row survived the full container restart, and Postgres logged:
```
PostgreSQL Database directory appears to contain a database; Skipping initialization
```
This confirms the named volume (`pgdata`) correctly persisted the data outside the container's lifecycle.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                          # Route handlers
│   │   └── content/
│   │       ├── content.repository.ts           # In-memory implementation
│   │       ├── content.postgres.repository.ts   # PostgreSQL implementation
│   │       ├── content.service.ts               # Business logic (storage-agnostic)
│   │       └── init.sql                         # DB schema init script
│   └── lib/
│       └── postgres.ts                   # PostgreSQL connection pool
├── Dockerfile                            # Next.js app image
├── docker-compose.yml                    # App + Postgres orchestration
├── .env.example                          # Template for required env vars
└── README.md
```

---

## 🔐 Environment & Security Notes

- `.env.local` is **gitignored** and never committed — it contains real credentials.
- `.env.example` is committed as a template showing which variables are required, without real values.
- Postgres credentials in this setup (`postgres` / `postgres`) are for **local development only** and are not suitable for production use.

---

## 🧠 Design Notes — Why This Matters

The whole point of the layered architecture is **isolation of concerns**:

- The **Route** layer doesn't know or care how data is stored.
- The **Service** layer only talks to a `Repository` interface — never a database driver directly.
- The **Repository** layer is the only place that knows about Postgres, SQL, or connection pooling.

Because of this, migrating from an in-memory store to a real, persistent PostgreSQL database required **zero changes** to business logic or API contracts — only a one-line import swap. This is the architecture proving itself.

---

## 🩹 Stretch Goals (Optional, Not Implemented)

- [ ] Add Redis to `docker-compose.yml` for caching (planned for Week 4)
- [ ] Add an index on `posts` and benchmark with `EXPLAIN ANALYZE`

---

**Author:** Numair Iqbal
**Program:** FlyRank AI — Backend AI Engineering Track
**Assignment:** BE-04 — Docker + PostgreSQL Integration
