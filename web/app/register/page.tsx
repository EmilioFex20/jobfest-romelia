import { SignUpForm } from "@/components/SignUpForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-md px-6 py-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
            / Registro
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            Crea tu cuenta
          </h1>
        </div>
      </main>
      <SignUpForm />
      <Footer />
    </>
  );
}
