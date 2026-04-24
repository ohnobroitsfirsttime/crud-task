import UserCard from "../components/UserCard";
import { User } from "@/lib/types";

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 80px" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "28px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          <span
            style={{
              fontFamily: "sans-serif",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.03em",
            }}
          >
            User-Data
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {users.length} records
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {/* Title block */}
        <div className="animate-fade-up" style={{ marginBottom: 48 }}>
          <p
            style={{
              color: "var(--accent)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            HomePage
          </p>
          <h1 style={{ fontSize: 42, color: "var(--text-primary)" }}>
            All Users
          </h1>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {users.map((user, i) => (
            <UserCard key={user.id} user={user} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}


