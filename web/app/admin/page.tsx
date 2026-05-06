"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse = {
  authenticated: boolean;
  role?: string;
  email?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function loadMe() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!res.ok || data.role !== "admin") {
        router.replace("/");
        return;
      }

      setMe(data);
      setLoading(false);
    }

    loadMe();
  }, [router]);

  if (loading) {
    return <main className="p-8">Cargando...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Panel de administrador</h1>

      <p className="mt-2 text-gray-600">Sesión iniciada como {me?.email}</p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <a href="/admin/students" className="rounded-xl border p-5">
          <h2 className="font-semibold">Alumnos</h2>
          <p className="text-sm text-gray-500">Ver alumnos registrados.</p>
        </a>

        <a href="/admin/cvs" className="rounded-xl border p-5">
          <h2 className="font-semibold">CVs</h2>
          <p className="text-sm text-gray-500">Revisar CVs generados.</p>
        </a>

        <a href="/admin/users" className="rounded-xl border p-5">
          <h2 className="font-semibold">Usuarios admin</h2>
          <p className="text-sm text-gray-500">Crear otros administradores.</p>
        </a>
      </section>
    </main>
  );
}
