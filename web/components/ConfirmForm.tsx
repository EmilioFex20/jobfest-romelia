"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  code: z.string(),
});

export function ConfirmForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      form.reset({
        email: emailFromParams,
        code: "",
      });
    }
  }, [searchParams, form]);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = form.watch("email");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/confirm", {
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

      router.push("/login");
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
                <Field>
                  <FieldLabel>Correo</FieldLabel>
                  <div className="px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">
                    {email}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-form-code">
                    Código de verificación
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Código"
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
