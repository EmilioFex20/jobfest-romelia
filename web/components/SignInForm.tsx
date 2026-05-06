"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
  email: z
    .string()
    .email("Ingresa una dirección de correo válida.")
    .refine((email) => email.endsWith("@cetys.edu.mx"), {
      message: "El correo debe ser institucional (@cetys.edu.mx).",
    }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión");
      }

      if (data.success) {
        router.push(data.redirectTo || "/student");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto bg-ink text-bone">
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-form-email">Correo</FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-email"
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
                  <FieldLabel htmlFor="sign-in-form-password">
                    Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Contraseña"
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
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="sign-in-form"
            className="w-full hover:cursor-pointer hover:bg-ember"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
