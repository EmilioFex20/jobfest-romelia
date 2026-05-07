"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    email: z
      .string()
      .email("Ingresa una dirección de correo válida.")
      .refine((email) => email.endsWith("@cetys.edu.mx"), {
        message: "El correo debe ser institucional (@cetys.edu.mx).",
      }),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "USER_EXISTS") {
          const msg = "Ese correo ya está registrado. Intenta iniciar sesión.";
          setError(msg);
          toast.error(msg);
          return;
        }

        throw new Error(data.message || "No se pudo registrar");
      }

      setMessage(data.message);
      toast.success("Cuenta creada. Revisa tu correo para confirmar.");
      router.push(`/confirm?email=${encodeURIComponent(values.email)}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Ocurrió un error al registrarse";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto bg-ink text-bone">
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-form-email">Correo</FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="alumno@cetys.edu.mx"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-form-password">
                    Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-form-confirmPassword">
                    Confirmar Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-form-confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirmar contraseña"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="sign-up-form"
            className="w-full hover:cursor-pointer hover:bg-ember"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
