"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterInput } from "@/lib/actions/register";

const formSchema = z.object({
  name: z.string().min(2, "Informe um nome válido"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data?.message) {
            setError(data.message);
          } else if (data?.error) {
            setError("Verifique os dados informados.");
          } else {
            setError("Não foi possível concluir o cadastro. Tente novamente.");
          }
          return;
        }

        const loginResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (loginResult?.error) {
          router.push("/auth/login?registered=1");
          return;
        }

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setError("Erro inesperado. Tente novamente.");
      }
    });
  };

  return (
    <Card className="border-[#4B006E]/10 bg-white/80">
      <CardHeader>
        <CardTitle className="text-2xl text-[#4B006E]">Crie sua conta</CardTitle>
        <CardDescription>
          Em poucos passos você acessa conteúdos exclusivos e começa a receber pelos caroços recolhidos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Mínimo 6 caracteres" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full bg-[#4B006E] hover:bg-[#35004f]" disabled={isPending}>
            {isPending ? "Cadastrando..." : "Criar conta e acessar"}
          </Button>
        </form>
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Entrar com Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        <span>
          Já possui conta? <Link className="text-[#4B006E] underline" href="/auth/login">Faça login</Link>
        </span>
        <p className="text-xs text-muted-foreground">
          Ao cadastrar-se você concorda em receber comunicações sobre oportunidades no mercado de açaí.
        </p>
      </CardFooter>
    </Card>
  );
}