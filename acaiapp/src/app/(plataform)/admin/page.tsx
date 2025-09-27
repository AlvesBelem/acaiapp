import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";

import { DeleteProductButton } from "@/components/platform/delete-product-button";
import { ProductForm } from "@/components/platform/product-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Administração | Açaí Leads",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [users, leads, products] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.lead.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-[#4B006E]/10 bg-white/80">
          <CardHeader>
            <CardTitle className="text-[#4B006E]">Cadastrar novo produto digital</CardTitle>
            <CardDescription>
              Adicione links da Hotmart com conteúdos exclusivos para a comunidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm />
          </CardContent>
        </Card>
        <Card className="border-[#4B006E]/10 bg-white/80">
          <CardHeader>
            <CardTitle className="text-[#4B006E]">Exportações</CardTitle>
            <CardDescription>Baixe dados atualizados de usuários e leads em CSV.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="bg-[#4B006E] hover:bg-[#35004f]">
              <Link href="/api/export/users">Exportar usuários</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#4B006E]/30 text-[#4B006E] hover:bg-[#F5F5DC]">
              <Link href="/api/export/leads">Exportar leads</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#4B006E]">Produtos cadastrados</h2>
          <p className="text-sm text-[#4B006E]/70">Edite ou remova conteúdos disponíveis para os usuários.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} className="border-[#4B006E]/10 bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg text-[#4B006E]">{product.title}</CardTitle>
                <CardDescription className="text-[#4B006E]/70">{product.hotmartUrl}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <details className="group rounded-md border border-dashed border-[#4B006E]/20 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#4B006E]">
                    Editar produto
                  </summary>
                  <div className="mt-4 space-y-4">
                    <ProductForm
                      productId={product.id}
                      defaultValues={{
                        title: product.title,
                        description: product.description,
                        hotmartUrl: product.hotmartUrl,
                        imageUrl: product.imageUrl,
                      }}
                    />
                    <DeleteProductButton productId={product.id} />
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && (
            <Card className="border-[#4B006E]/10 bg-white/80">
              <CardHeader>
                <CardTitle className="text-[#4B006E]">Nenhum produto encontrado</CardTitle>
                <CardDescription>Cadastre um produto para que ele apareça para os usuários.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-[#4B006E]">Usuários</h2>
          <p className="text-sm text-[#4B006E]/70">Todos os usuários têm acesso automático como leads.</p>
        </div>
        <Card className="border-[#4B006E]/10 bg-white/80">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5DC] text-[#4B006E]">
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Entrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-[#4B006E]">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {format(user.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Total de {users.length} usuários.</TableCaption>
          </Table>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-[#4B006E]">Leads gerados</h2>
          <p className="text-sm text-[#4B006E]/70">Cada cadastro cria um lead vinculado ao usuário.</p>
        </div>
        <Card className="border-[#4B006E]/10 bg-white/80">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5DC] text-[#4B006E]">
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Entrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-[#4B006E]">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.user?.name}</TableCell>
                  <TableCell>
                    {format(lead.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Total de {leads.length} leads.</TableCaption>
          </Table>
        </Card>
      </section>
    </div>
  );
}