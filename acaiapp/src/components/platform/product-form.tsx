"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(3, "Informe um título"),
  description: z.string().min(10, "Descrição muito curta"),
  hotmartUrl: z.string().url("Informe uma URL válida"),
  imageUrl: z.string().url("Informe uma imagem válida"),
});

export type ProductFormValues = z.infer<typeof schema>;

type ProductFormProps = {
  productId?: string;
  defaultValues?: ProductFormValues;
  onSuccess?: () => void;
};

export function ProductForm({ productId, defaultValues, onSuccess }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      hotmartUrl: "",
      imageUrl: "",
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    setError(null);
    startTransition(async () => {
      const endpoint = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setError("Não foi possível salvar o produto. Verifique os dados.");
        return;
      }

      if (!productId) {
        form.reset();
      }

      onSuccess?.();
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Nome do produto" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" placeholder="Descreva os benefícios" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="hotmartUrl">Link Hotmart</Label>
        <Input id="hotmartUrl" placeholder="https://hotmart.com/..." {...form.register("hotmartUrl")} />
        {form.formState.errors.hotmartUrl && (
          <p className="text-sm text-red-600">{form.formState.errors.hotmartUrl.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Imagem</Label>
        <Input id="imageUrl" placeholder="https://..." {...form.register("imageUrl")} />
        {form.formState.errors.imageUrl && (
          <p className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="bg-[#4B006E] hover:bg-[#35004f]" disabled={isPending}>
        {isPending ? "Salvando..." : productId ? "Atualizar produto" : "Cadastrar produto"}
      </Button>
    </form>
  );
}