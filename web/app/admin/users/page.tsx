"use client";

import { useState } from "react";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "No se pudo crear el admin.");
        return;
      }

      setMessage("Administrador creado correctamente.");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-3xl font-bold">Crear administrador</h1>

      <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="correo@cetys.edu.mx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border p-2"
        />

        <button disabled={loading} className="btn-primary">
          {loading ? "Creando..." : "Crear admin"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-md bg-gray-100 p-3 text-sm">{message}</p>
      )}
    </main>
  );
}
