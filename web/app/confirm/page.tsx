import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConfirmForm } from "@/components/ConfirmForm";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-md px-6 py-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
            / Confirmación
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            Confirma tu cuenta
          </h1>
        </div>
      </main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-md px-6 py-8 text-sm text-ink/60">
            Cargando formulario de confirmación...
          </div>
        }
      >
        <ConfirmForm />
      </Suspense>
      <Footer />
    </>
  );
}
