"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Digite sua senha"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registered = searchParams.get("registered");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <Card className="border-[#4B006E]/10 bg-white/80">
      <CardHeader>
        <CardTitle className="text-2xl text-[#4B006E]">Acesse sua conta</CardTitle>
        <CardDescription>
          Utilize suas credenciais ou entre com Google para visualizar os conteúdos e oportunidades disponíveis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registered && (
          <div className="rounded-md bg-[#F5F5DC] p-3 text-sm text-[#4B006E]">
            Cadastro realizado! Faça login com os dados informados ou com sua conta Google.
          </div>
        )}
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Sua senha" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full bg-[#4B006E] hover:bg-[#35004f]" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Entrar com Google
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Ainda não tem conta? <Link className="ml-1 text-[#4B006E] underline" href="/auth/register">Cadastre-se</Link>
      </CardFooter>
    </Card>
  );
}