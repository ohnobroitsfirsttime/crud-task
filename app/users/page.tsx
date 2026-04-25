"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import UserCard from "../components/UserCard";
import api from "@/lib/axios";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<User[]>("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        setError("Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 80px" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "28px 40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 20 }}>UserData</span>

        <div style={{ fontSize: 12 }}>
          {users.length} records
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 42 }}>All Users</h1>

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
