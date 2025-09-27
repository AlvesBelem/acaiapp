import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard | Açaí Leads",
};

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="rounded-3xl bg-gradient-to-r from-[#4B006E] to-[#6A0DAD] p-10 text-white shadow-2xl">
        <h1 className="text-3xl font-bold">Bem-vindo à sua central de oportunidades</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Explore materiais digitais, treinamentos e ferramentas que vão acelerar a monetização do seu caroço de açaí e abrir
          novos canais de venda.
        </p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#4B006E]">Produtos digitais</h2>
            <p className="text-sm text-[#4B006E]/70">
              Conteúdos selecionados e hospedados na Hotmart para você comprar com segurança.
            </p>
          </div>
        </div>
        {products.length === 0 ? (
          <Card className="border-[#4B006E]/10 bg-white/80">
            <CardHeader>
              <CardTitle className="text-[#4B006E]">Nenhum produto cadastrado ainda</CardTitle>
              <CardDescription>
                Assim que a curadoria liberar novos conteúdos, eles aparecerão aqui.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col border-[#4B006E]/10 bg-white/80">
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl text-[#4B006E]">{product.title}</CardTitle>
                  <CardDescription className="text-[#4B006E]/80">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-[#4B006E] hover:bg-[#35004f]">
                    <Link href={product.hotmartUrl} target="_blank" rel="noopener noreferrer">
                      Comprar agora
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}