"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type DeleteProductButtonProps = {
  productId: string;
  onDeleted?: () => void;
};

export function DeleteProductButton({ productId, onDeleted }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDeleted?.();
        router.refresh();
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="border-red-200 text-red-600 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isPending}
      type="button"
    >
      {isPending ? "Removendo..." : "Remover"}
    </Button>
  );
}