"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2 w-2 bg-ember" />
          <span className="font-display text-2xl font-medium tracking-tight">
            JobFest
          </span>
          <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">
            · cetys
          </span>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
          aria-label="Menú"
        >
          {open ? "×" : "≡"}
        </button>

        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-4 border-y border-ink/10 bg-bone/90 p-6 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-none md:bg-transparent md:p-0`}
        >
          <Link
            href="/companies"
            className="text-sm tracking-tight hover:text-ember"
          >
            Empresas
          </Link>
          <Link
            href="/login"
            className="text-sm tracking-tight hover:text-ember"
          >
            Iniciar sesión
          </Link>
          <Link href="/register">
            <Button variant="primary" size="cta">
              Registrarme
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
