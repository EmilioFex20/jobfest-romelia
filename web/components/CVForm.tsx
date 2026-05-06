"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Experience = {
  place: string;
  start: string;
  end: string;
  desc: string;
};

type Project = {
  title: string;
  desc: string;
};

type GenerateCVResponse = {
  success: boolean;
  message?: string;
  url?: string;
  download_url?: string;
};

export default function CVForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const router = useRouter();

  const [experience, setExperience] = useState<Experience[]>([
    {
      place: "",
      start: "",
      end: "",
      desc: "",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      title: "",
      desc: "",
    },
  ]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setDownloadUrl(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),
      phone: String(formData.get("phone") || "").trim(),

      major: String(formData.get("major") || "").trim(),
      semester: String(formData.get("semester") || "").trim(),
      gpa: String(formData.get("gpa") || "").trim(),
      relevantCoursework: String(
        formData.get("relevantCoursework") || "",
      ).trim(),
      professionalProfile: String(
        formData.get("professionalProfile") || "",
      ).trim(),

      experience: experience.filter(
        (exp) => exp.place.trim() || exp.desc.trim(),
      ),

      projects: projects.filter(
        (project) => project.title.trim() || project.desc.trim(),
      ),

      technicalSkills: String(formData.get("technicalSkills") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      softSkills: String(formData.get("softSkills") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      languages: String(formData.get("languages") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as GenerateCVResponse;

      if (!res.ok) {
        setMessage(data.message || "Ocurrió un error al generar el CV.");
        return;
      }

      const url = data.url || data.download_url || null;

      setMessage(data.message || "CV generado correctamente.");
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function updateExperience(
    index: number,
    field: keyof Experience,
    value: string,
  ) {
    const copy = [...experience];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setExperience(copy);
  }

  function removeExperience(index: number) {
    setExperience((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function updateProject(index: number, field: keyof Project, value: string) {
    const copy = [...projects];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setProjects(copy);
  }

  function removeProject(index: number) {
    setProjects((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="text-2xl font-bold">Generar CV JobFest</h1>
        <p className="text-sm text-gray-500">
          Llena tu información para generar tu CV automáticamente.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Información personal</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="firstName"
            placeholder="Nombre"
            required
            className="rounded-md border p-2"
          />

          <input
            name="lastName"
            placeholder="Apellido"
            required
            className="rounded-md border p-2"
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            required
            className="rounded-md border p-2"
          />

          <input
            name="phone"
            placeholder="Teléfono"
            required
            className="rounded-md border p-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Información académica</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="major"
            placeholder="Carrera"
            required
            className="rounded-md border p-2"
          />

          <input
            name="semester"
            placeholder="Semestre"
            required
            className="rounded-md border p-2"
          />

          <input
            name="gpa"
            placeholder="Promedio / GPA"
            className="rounded-md border p-2"
          />

          <input
            name="relevantCoursework"
            placeholder="Cursos relevantes"
            className="rounded-md border p-2"
          />
        </div>

        <textarea
          name="professionalProfile"
          placeholder="Perfil profesional"
          required
          rows={4}
          className="w-full rounded-md border p-2"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Experiencia</h2>

        {experience.map((exp, index) => (
          <div key={index} className="space-y-3 rounded-md border p-4">
            <input
              placeholder="Lugar / Empresa"
              value={exp.place}
              onChange={(e) => updateExperience(index, "place", e.target.value)}
              className="w-full rounded-md border p-2"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="Fecha de inicio"
                value={exp.start}
                onChange={(e) =>
                  updateExperience(index, "start", e.target.value)
                }
                className="rounded-md border p-2"
              />

              <input
                placeholder="Fecha de fin o actual"
                value={exp.end}
                onChange={(e) => updateExperience(index, "end", e.target.value)}
                className="rounded-md border p-2"
              />
            </div>

            <textarea
              placeholder="Descripción breve"
              value={exp.desc}
              onChange={(e) => updateExperience(index, "desc", e.target.value)}
              rows={3}
              className="w-full rounded-md border p-2"
            />

            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="rounded-md border px-3 py-2 text-sm text-red-600"
              >
                Eliminar experiencia
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setExperience([
              ...experience,
              {
                place: "",
                start: "",
                end: "",
                desc: "",
              },
            ])
          }
          className="rounded-md border px-4 py-2 text-sm"
        >
          Agregar experiencia
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Proyectos</h2>

        {projects.map((project, index) => (
          <div key={index} className="space-y-3 rounded-md border p-4">
            <input
              placeholder="Título del proyecto"
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              className="w-full rounded-md border p-2"
            />

            <textarea
              placeholder="Descripción breve"
              value={project.desc}
              onChange={(e) => updateProject(index, "desc", e.target.value)}
              rows={3}
              className="w-full rounded-md border p-2"
            />

            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="rounded-md border px-3 py-2 text-sm text-red-600"
              >
                Eliminar proyecto
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setProjects([
              ...projects,
              {
                title: "",
                desc: "",
              },
            ])
          }
          className="rounded-md border px-4 py-2 text-sm"
        >
          Agregar proyecto
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Habilidades e idiomas</h2>

        <input
          name="technicalSkills"
          placeholder="Habilidades técnicas separadas por coma. Ej: React, Python, AWS"
          className="w-full rounded-md border p-2"
        />

        <input
          name="softSkills"
          placeholder="Habilidades blandas separadas por coma. Ej: Liderazgo, Comunicación"
          className="w-full rounded-md border p-2"
        />

        <input
          name="languages"
          placeholder="Idiomas separados por coma. Ej: Español, Inglés"
          className="w-full rounded-md border p-2"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Generando..." : "Guardar y generar CV"}
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Descargar CV
          </a>
        )}

        <button
          type="button"
          onClick={() => router.push("/student/cv/generate")}
          className="btn-ghost"
        >
          Ir a mis CVs
        </button>
      </div>

      {message && (
        <p className="rounded-md bg-gray-100 p-3 text-center text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
