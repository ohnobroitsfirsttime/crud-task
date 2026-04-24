"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { User } from "@/lib/types";

export default function UserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update form state
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get<User>(`/users/${params.id}`)
      .then((res) => {
        setUser(res.data);
        setFormName(res.data.name);
        setFormEmail(res.data.email);
      })
      .catch(() => setError("User not found."))
      .finally(() => setLoading(false));
  }, [params.id]);

  function openForm() {
    if (user) {
      setFormName(user.name);
      setFormEmail(user.email);
    }
    setUpdateSuccess(false);
    setShowForm(true);
  }

  async function handleUpdate() {
    if (!user) return;
    setUpdating(true);

    // Update
    const previous = { ...user };
    setUser((u) => u ? { ...u, name: formName, email: formEmail } : u);
    setShowForm(false);

    try {
      await api.put(`/users/${user.id}`, {
        ...user,
        name: formName,
        email: formEmail,
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch {
      setUser(previous);
      setShowForm(true);
      alert("Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    if (!confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
    setDeleting(true);

    router.push("/users");

    try {
      await api.delete(`/users/${user.id}`);
    } catch {
      console.error("Delete failed");
    }
  }

  //Loading skeleton
  if (loading) {
    return (
      <PageShell>
        <div
          style={{
            display: "grid",
            gap: 16,
            maxWidth: 600,
            margin: "0 auto",
            paddingTop: 48,
          }}
        >
          {[160, 90, 90, 120].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: "var(--radius)",
                background:
                  "linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          ))}
        </div>
      </PageShell>
    );
  }

  //Error
  if (error || !user) {
    return (
      <PageShell>
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              marginBottom: 8,
              color: "var(--danger)",
            }}
          >
            {error || "User not found"}
          </h2>
          <Link
            href="/users"
            style={{ color: "var(--accent)", fontSize: 13 }}
          >
            ← Back to users
          </Link>
        </div>
      </PageShell>
    );
  }

  const avatarHue = (user.id * 47) % 360;

  //Main UI 
  return (
    <PageShell>
      <div
        style={{ maxWidth: 640, margin: "0 auto", paddingTop: 48 }}
        className="animate-fade-up"
      >
        {/* Back link */}
        <Link
          href="/users"
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            letterSpacing: "0.06em",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 36,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--text-secondary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--text-muted)")
          }
        >
          ← Back
        </Link>

        {/* Profile card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            marginBottom: 16,
          }}
          className="animate-fade-up animate-fade-up-delay-1"
        >
          {/* Color bar */}
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, hsl(${avatarHue},60%,45%), hsl(${(avatarHue + 60) % 360},60%,55%))`,
            }}
          />

          <div style={{ padding: "32px 32px 28px" }}>
            {/* Avatar + name */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `hsl(${avatarHue}, 55%, 22%)`,
                  border: `3px solid hsl(${avatarHue}, 55%, 38%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: "Syne, sans-serif",
                  color: `hsl(${avatarHue}, 80%, 80%)`,
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 28,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {user.name}
                </h1>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  @{user.username} · ID #{user.id}
                </span>
              </div>
            </div>

            {/* Fields grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phone} />
              <Field label="Website" value={user.website} />
              <Field label="Company" value={user.company.name} />
              <Field
                label="Address"
                value={`${user.address.street}, ${user.address.city}`}
                full
              />
            </div>
          </div>
        </div>

        {/* Success toast */}
        {updateSuccess && (
          <div
            className="animate-fade-up"
            style={{
              background: "rgba(74, 222, 128, 0.1)",
              border: "1px solid rgba(74, 222, 128, 0.3)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              color: "var(--success)",
              fontSize: 13,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            User updated successfully
          </div>
        )}

        {/*Buttons */}
        <div
          style={{ display: "flex", gap: 12 }}
          className="animate-fade-up animate-fade-up-delay-2"
        >
          <button
            onClick={openForm}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-dim)",
              color: "var(--accent)",
              border: "1px solid rgba(124,106,255,0.25)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "background 0.15s, box-shadow 0.15s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(124,106,255,0.25)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-dim)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Update
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--danger-dim)",
              color: "var(--danger)",
              border: "1px solid rgba(255,94,106,0.25)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.06em",
              cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.6 : 1,
              transition: "background 0.15s, box-shadow 0.15s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              if (!deleting) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,94,106,0.22)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 20px rgba(255,94,106,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--danger-dim)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>

        {/* Update form */}
        {showForm && (
          <div
            className="animate-fade-up"
            style={{
              marginTop: 20,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "28px 32px",
            }}
          >
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 18,
                marginBottom: 20,
                color: "var(--text-primary)",
              }}
            >
              Edit User
            </h3>

            <div style={{ display: "grid", gap: 16 }}>
              <label>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Name
                </div>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--accent)")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--border)")
                  }
                />
              </label>

              <label>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Email
                </div>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--accent)")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--border)")
                  }
                />
              </label>
            </div>

            <div
              style={{ display: "flex", gap: 12, marginTop: 20 }}
            >
              <button
                onClick={handleUpdate}
                disabled={updating || !formName.trim() || !formEmail.trim()}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  cursor:
                    updating || !formName.trim() || !formEmail.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    updating || !formName.trim() || !formEmail.trim()
                      ? 0.6
                      : 1,
                  transition: "opacity 0.15s, box-shadow 0.15s",
                }}
              >
                {updating ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--border-hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--border)")
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

//Sub-components 

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      style={{
        gridColumn: full ? "1 / -1" : undefined,
        background: "var(--surface-2)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-primary)",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
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
        <Link
          href="/users"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          
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
        </Link>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
          }}
        >
          USER PROFILE
        </div>
      </header>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        {children}
      </main>
    </div>
  );
}
