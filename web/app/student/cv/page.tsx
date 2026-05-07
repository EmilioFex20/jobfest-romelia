"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVForm from "@/components/CVForm";

export default function CVEditor() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink/60">
            / CV
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            Tu información profesional
          </h1>
        </div>
        <CVForm />
      </main>
      <Footer />
    </>
  );
}
