<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=FlyRank%20BE-04&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Docker%20%2B%20PostgreSQL%20Integration&descAlignY=55&descSize=20" width="100%"/>

<br>

<img src="https://skillicons.dev/icons?i=nextjs,typescript,postgres,docker&theme=dark" height="70"/>

<br><br>

![Status](https://img.shields.io/badge/STATUS-COMPLETED-00C853?style=for-the-badge&labelColor=1a1a1a)
![Architecture](https://img.shields.io/badge/ARCHITECTURE-LAYERED-FF6D00?style=for-the-badge&labelColor=1a1a1a)
![Database](https://img.shields.io/badge/DATABASE-POSTGRESQL-336791?style=for-the-badge&labelColor=1a1a1a&logo=postgresql&logoColor=white)

<br>

### *A production-style layered architecture, proven through a real storage migration —*
### *from an in-memory store to a persistent, containerized PostgreSQL database.*

</div>

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=100%"/>

<br>

## 📌 Overview

> **The one idea this project proves:** when storage layers are properly isolated, swapping the entire persistence engine — from memory to a real database — requires changing exactly **one line of code**.

The `Route → Service → Repository` pattern used here means business logic never touches the database directly. It only ever talks to an interface. Because of that discipline, migrating from an **in-memory store** to a fully containerized **PostgreSQL database** touched only the import statement in `content.service.ts` — nothing else moved.

**The feature:** A post-view tracking endpoint that increments a post's `view_count` and triggers a notification once the count crosses a threshold.

<br>

## 🏛️ Architecture

<div align="center">
<table>
<tr>
<td align="center" width="200">

### 🌐
### ROUTE
**HTTP Layer**

</td>
<td align="center">➜</td>
<td align="center" width="200">

### ⚙️
### SERVICE
**Business Logic**

</td>
<td align="center">➜</td>
<td align="center" width="220">

### 🗄️
### REPOSITORY
**In-Memory ⇄ PostgreSQL**

</td>
</tr>
</table>
</div>

<br>

<div align="center">

| Layer | File | Responsibility | Hard Rule |
|:--:|:--:|:--|:--|
| 🌐 **Route** | `route.ts` | Handles the HTTP request/response | No business logic, no direct DB calls |
| ⚙️ **Service** | `content.service.ts` | Business rules (view-count logic, notification threshold) | No HTTP or DB code |
| 🗄️ **Repository** | `content.repository.ts` / `content.postgres.repository.ts` | Talks directly to storage | No business logic |

</div>

<br>

### 📊 Full Architecture Diagram

<div align="center">

![Layered Architecture Diagram](./layered-architecture-diagram.png)

</div>

<br>

## 🔁 The One-Line Proof

<table>
<tr>
<th align="center" width="50%">❌ Before — In-Memory</th>
<th align="center" width="50%">✅ After — PostgreSQL</th>
</tr>
<tr>
<td>

```ts
import { ContentRepository } 
  from "./content.repository";
```

</td>
<td>

```ts
import { ContentPostgresRepository 
  as ContentRepository } 
  from "./content.postgres.repository";
```

</td>
</tr>
</table>

<div align="center">

**Everything else in `content.service.ts` stayed byte-for-byte identical.**

</div>

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=100%"/>

<br>

## 🔄 How It Works

1. **Client** sends a `POST` request with a `postId`.
2. **Route** validates the request and passes control to the Service — it does not touch the database.
3. **Service** fetches the post via the Repository, increments the view count, and checks if a notification threshold (100 views) has been reached.
4. **Repository** performs the actual database read/write — it contains zero business rules.

```
POST /api/content
Body: { "postId": "uuid-here" }
```

<div align="center">

| Status | Meaning |
|:--:|:--|
| `200` | View registered successfully |
| `400` | Missing `postId` |
| `500` | Server / database error |

</div>

<br>

## 🧰 Tech Stack

<div align="center">

<table>
<tr>
<td align="center" width="150"><b>Framework</b><br>Next.js 16</td>
<td align="center" width="150"><b>Language</b><br>TypeScript</td>
<td align="center" width="150"><b>Database</b><br>PostgreSQL 16</td>
<td align="center" width="150"><b>Containers</b><br>Docker Compose</td>
<td align="center" width="150"><b>Driver</b><br>node-postgres</td>
</tr>
</table>

</div>

<br>

## ✨ What This Project Delivers

<table>
<tr><td>✅</td><td>PostgreSQL running in Docker with a <b>named volume</b> — data survives restarts</td></tr>
<tr><td>✅</td><td>Entire stack (app + database) boots with <b>one single command</b></td></tr>
<tr><td>✅</td><td>Secrets managed via <code>.env.local</code> — gitignored, with a safe <code>.env.example</code> committed</td></tr>
<tr><td>✅</td><td><code>ContentPostgresRepository</code> implements the <b>exact same interface</b> as the in-memory version</td></tr>
<tr><td>✅</td><td>Auto-provisioning SQL script — schema creates itself on first boot</td></tr>
<tr><td>✅</td><td><b>Persistence formally verified</b> across a full container + application restart</td></tr>
</table>

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=100%"/>

<br>

## 🚀 Quick Start

**1️⃣ Prerequisites** — [Docker Desktop](https://www.docker.com/products/docker-desktop/) running · Node.js 20+ · npm

**2️⃣ Clone & Enter**
```bash
git clone https://github.com/Numair-Iqbal/flyrank-layered-architecture-assignment.git
cd flyrank-layered-architecture-assignment
```

**3️⃣ Configure Environment**
```bash
cp .env.example .env.local
```
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flyrank_db
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4️⃣ Install & Launch**
```bash
npm install
docker compose up
```

<div align="center">

## 🎉 App live at → `http://localhost:3000`

</div>

This single command pulls **PostgreSQL 16**, provisions the schema via `init.sql`, builds the **Next.js** image, and wires both containers together on one network.

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=100%"/>

<br>

## 🗄️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,
  view_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

<br>

## ✅ Persistence Verification

<details open>
<summary><b>🔍 Click to expand the exact test performed</b></summary>

<br>

**Step 1 — Insert a row directly into the running container**
```bash
docker exec -it flyrank-layered-architecture-assignment-postgres-1 \
  psql -U postgres -d flyrank_db \
  -c "INSERT INTO posts (title, content) VALUES ('Persistence Test', 'Verifying data survives a restart') RETURNING id, title;"
```

**Step 2 — Tear down containers (volume untouched)**
```bash
docker compose down
```

**Step 3 — Restart the entire stack**
```bash
docker compose up
```

**Step 4 — Confirm the row survived**
```bash
docker exec -it flyrank-layered-architecture-assignment-postgres-1 \
  psql -U postgres -d flyrank_db -c "SELECT * FROM posts;"
```

</details>

<div align="center">

### ![Passed](https://img.shields.io/badge/RESULT-PASSED-00C853?style=for-the-badge&labelColor=1a1a1a)

</div>

Postgres logged the proof itself on restart:
```
PostgreSQL Database directory appears to contain a database; Skipping initialization
```

The `pgdata` named volume correctly persisted data **outside** the container lifecycle — exactly what the assignment required.

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=100%"/>

<br>

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── content/
│   │   │       └── route.ts                       # HTTP layer (POST handler)
│   │   └── content/
│   │       ├── content.repository.ts               # In-memory implementation
│   │       ├── content.postgres.repository.ts       # PostgreSQL implementation
│   │       ├── content.service.ts                   # Business logic (storage-agnostic)
│   │       └── init.sql                             # Schema init script
│   └── lib/
│       └── postgres.ts                             # Connection pool
├── layered-architecture-diagram.png                # Architecture diagram
├── Dockerfile                                      # Next.js app image
├── docker-compose.yml                              # App + Postgres orchestration
├── .env.example                                    # Required env var template
└── README.md
```

<br>

## 🧠 Design Decisions & Trade-offs

- **Why separate layers?** Each layer can be tested and modified independently — swapping the database engine only requires changing the Repository, never the Service or Route.
- **Trade-off:** This adds more files and indirection for a simple feature, which can feel like overhead on small projects. The benefit shows as the codebase grows — business logic stays decoupled from infrastructure, making it far easier to unit test and extend.

<br>

## 🔐 Security Notes

<div align="center">

| Item | Status |
|:--|:--:|
| `.env.local` committed to Git | ❌ Never — gitignored |
| `.env.example` committed | ✅ Template only, no real secrets |
| Postgres creds (`postgres`/`postgres`) | ⚠️ Local dev only |

</div>

<br>

## 🩹 Stretch Goals *(future work)*

- [ ] Add Redis to `docker-compose.yml` for caching *(Week 4)*
- [ ] Add an index on `posts` and benchmark with `EXPLAIN ANALYZE`

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer"/>

<div align="center">

**Numair Iqbal**
BS Computer Science — University of Layyah
Backend & AI Engineering Intern @ FlyRank AI

[![GitHub](https://img.shields.io/badge/GitHub-Numair--Iqbal-181717?style=flat-square&logo=github)](https://github.com/Numair-Iqbal)

BE-04 — Docker + PostgreSQL Integration

</div>
