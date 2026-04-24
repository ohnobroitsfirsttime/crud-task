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
