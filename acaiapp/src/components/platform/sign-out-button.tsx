"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="border-[#4B006E]/30 text-[#4B006E] hover:bg-[#F5F5DC]"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sair
    </Button>
  );
}