"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function DownloadCVPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDownload() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/download-cv", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "No se pudo descargar el CV.");
        return;
      }

      const downloadUrl = data.url;

      if (!downloadUrl) {
        setMessage("No se recibió URL de descarga.");
        return;
      }

      window.location.href = downloadUrl;
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Descargar CV</h1>

        <p className="mt-3 text-gray-600">
          Aquí puedes descargar el último CV que generaste.
        </p>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="btn-primary mt-6"
        >
          {loading ? "Preparando descarga..." : "Descargar CV"}
        </button>

        {message && (
          <p className="mt-4 rounded-md bg-gray-100 p-3 text-sm">{message}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
