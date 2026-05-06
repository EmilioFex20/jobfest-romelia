import { SignInForm } from "@/components/SignInForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-md px-6 py-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
            / Acceso
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            Iniciar sesión
          </h1>
        </div>
      </main>
      <SignInForm />
      <Footer />
    </>
  );
}
