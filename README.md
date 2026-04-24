# UserBase — Next.js CRUD App

A User management app built with **Next.js 14 App Router**, **TypeScript**, and **Axios**.

## Features

- `/users` — Lists all 10 users fetched from JSONPlaceholder (server component)
- `/users/[id]` — View full profile, update name/email, delete user
- **Optimistic updates** — UI updates instantly before API confirms
- **Axios interceptor** — Logs all requests and responses to console
- **TypeScript** throughout

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Axios (with request/response interceptors)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/users`.

## Project Structure

```
app/
  layout.tsx          # Root layout + global CSS import
  page.tsx            # Redirects to /users
  globals.css         # Design system (CSS variables, fonts, animations)
  users/
    page.tsx          # Server component — fetches & lists all users
    [id]/
      page.tsx        # Client component — view / update / delete user
lib/
  axios.ts            # Axios instance with interceptors
  types.ts            # User TypeScript interface
```

## Key Implementation Notes

### Optimistic Updates
Both update and delete are optimistic:
- **Update**: state is changed immediately, API call happens in background; rolls back on failure
- **Delete**: redirects to `/users` immediately, then calls `DELETE /users/:id`

### Axios Interceptor
Defined in `lib/axios.ts`:
- **Request**: logs `METHOD /path` before each call
- **Response**: logs status code + URL on success, error details on failure

### Why Server + Client Components?
- `/users` is a **Server Component** — data is fetched on the server for fast initial load
- `/users/[id]` is a **Client Component** (`"use client"`) — needed for useState, interactivity, and optimistic mutations

## Deploying to Vercel

1. Push to a public GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo → Deploy (zero config needed)

> Note: JSONPlaceholder does not persist data — PUT/DELETE calls succeed (return 200) but changes are not saved server-side. This is expected behavior.
