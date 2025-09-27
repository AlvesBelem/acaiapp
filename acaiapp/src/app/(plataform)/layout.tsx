import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/platform/sign-out-button";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Meu Perfil" },
];

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#faf5ff]">
      <header className="border-b border-[#4B006E]/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/dashboard" className="flex flex-col">
            <span className="text-xl font-bold text-[#4B006E]">Açaí Leads</span>
            <span className="text-xs text-[#4B006E]/70">Transforme caroço em lucro</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[#4B006E]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#35004f]">
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="font-semibold text-[#4B006E] hover:text-[#35004f]">
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-[#4B006E]">
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-[#4B006E]/70">{session.user?.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}