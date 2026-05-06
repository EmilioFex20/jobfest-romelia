import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, FileText, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Feature } from "@/components/Feature";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8">
              <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ink/60">
                <span className="h-px w-8 bg-ink/40" />
                <span>Edición 2026 · Mexicali</span>
              </div>
              <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
                El evento donde
                <br />
                <em className="italic text-ember">talento</em> y
                <br />
                oportunidad
                <br />
                se cruzan.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
                JobFest centraliza el proceso de vinculación entre estudiantes
                de CETYS y empresas participantes. Registra tu perfil, genera tu
                CV y postúlate a vacantes reales — todo en un solo lugar.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/register?role=student">
                  <Button variant="primary" size="cta">
                    Soy estudiante
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register?role=company">
                  <Button variant="ghost" size="cta">
                    Soy empresa
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:col-span-4 md:block">
              <div className="sticky top-24 space-y-4">
                <StatCard label="Estudiantes" value="120+" accent />
                <StatCard label="Empresas" value="25" />
                <StatCard label="Vacantes activas" value="60" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-ink/10 bg-ink text-bone">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-bone/50">
                  / 01 — Funcionalidades
                </div>
                <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                  Una plataforma, tres perfiles.
                </h2>
              </div>
            </div>

            <div className="grid gap-px bg-bone/10 md:grid-cols-3">
              <Feature
                icon={<Users className="h-5 w-5" />}
                title="Estudiantes"
                points={[
                  "Perfil académico completo",
                  "Generación automática de CV",
                  "Postulación a vacantes",
                ]}
              />
              <Feature
                icon={<Briefcase className="h-5 w-5" />}
                title="Empresas"
                points={[
                  "Publicación de vacantes",
                  "Revisión de candidatos",
                  "Descarga de CVs",
                ]}
              />
              <Feature
                icon={<FileText className="h-5 w-5" />}
                title="Administración"
                points={[
                  "Panel centralizado",
                  "Métricas del evento",
                  "Control de información",
                ]}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink/60">
                / 02 — Siguientes pasos
              </div>
              <h3 className="font-display text-4xl tracking-tight md:text-5xl">
                Regístrate hoy.
                <br />
                <em className="italic text-ember">Postúlate mañana.</em>
              </h3>
            </div>
            <div className="md:col-span-6 md:pt-4">
              <ol className="space-y-5">
                {[
                  "Crea tu cuenta en menos de 2 minutos",
                  "Completa tu perfil y genera tu CV",
                  "Explora empresas y vacantes disponibles",
                  "Postúlate a las que se ajusten a tu perfil",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-4 border-b border-ink/10 pb-5"
                  >
                    <span className="font-mono text-xs text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg">{step}</span>
                  </li>
                ))}
              </ol>
              <Link href="/register" className="mt-8 inline-flex">
                <Button variant="primary" size="cta">
                  Empezar ahora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
