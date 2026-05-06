"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink/60">
            / Panel del estudiante
          </div>
          <h1 className="font-display text-5xl tracking-tight md:text-6xl">
            Hola,{" "}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <ActionCard
            title="Completa tu CV"
            description="Ingresa tu experiencia, habilidades y proyectos."
            href="/student/cv"
            cta="Editar CV"
          />
          <ActionCard
            title="Genera tu CV"
            description="Descarga un PDF profesional de tu perfil."
            href="/student/cv/generate"
            cta="Generar"
          />
          <ActionCard
            title="Horario"
            description="Consulta el horario de tu entrevista."
            href="/student/cv/generate"
            cta="Consultar"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function ActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="card group flex flex-col">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink/70">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ember">
        {cta} →
      </span>
    </Link>
  );
}
