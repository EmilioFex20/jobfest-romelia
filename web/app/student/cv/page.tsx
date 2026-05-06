"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVForm from "@/components/CVForm";

interface CVData {
  summary: string;
  education: { institution: string; degree: string; period: string }[];
  experience: { company: string; position: string; description: string }[];
  skills: string[];
  projects: { name: string; description: string }[];
}

const empty: CVData = {
  summary: "",
  education: [{ institution: "", degree: "", period: "" }],
  experience: [{ company: "", position: "", description: "" }],
  skills: [],
  projects: [{ name: "", description: "" }],
};

export default function CVEditor() {
  const [data, setData] = useState<CVData>(empty);
  const [skillsInput, setSkillsInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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
