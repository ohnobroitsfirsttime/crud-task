"use client"
import Link from "next/link";
import { User } from "@/lib/types";

export default function UserCard({ user, index }: { user: User; index: number }) {
    const delays = ["0s", "0.05s", "0.1s", "0.15s", "0.2s"];
    const delay = delays[index % delays.length];
  
    return (
      <div
        className="animate-fade-up"
        style={{
          animationDelay: delay,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--border-hover)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 8px 32px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `hsl(${(user.id * 47) % 360}, 60%, 30%)`,
              border: `2px solid hsl(${(user.id * 47) % 360}, 60%, 45%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "Syne, sans-serif",
              flexShrink: 0,
              color: `hsl(${(user.id * 47) % 360}, 80%, 85%)`,
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 1,
              }}
            >
              @{user.username}
            </div>
          </div>
        </div>
  
        {/* Email */}
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            padding: "8px 10px",
            background: "var(--surface-2)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.email}
        </div>
  
        {/* ID badge + View button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            ID #{user.id}
          </span>
          <Link href={`/users/${user.id}`}>
            <button
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--accent-dim)",
                color: "var(--accent)",
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid rgba(124,106,255,0.25)",
                cursor: "pointer",
                transition: "background 0.15s, box-shadow 0.15s",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(124,106,255,0.25)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 14px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent-dim)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              View →
            </button>
          </Link>
        </div>
      </div>
    );
  }