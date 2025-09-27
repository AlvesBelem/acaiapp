import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar na plataforma | Açaí Leads",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5F5DC] via-white to-[#f5e3ff] p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}