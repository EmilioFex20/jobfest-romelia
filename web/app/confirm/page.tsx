import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConfirmForm } from "@/components/ConfirmForm";

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
      <ConfirmForm />
      <Footer />
    </>
  );
}
