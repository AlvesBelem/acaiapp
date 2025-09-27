import { getServerSession } from "next-auth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Meu Perfil | Açaí Leads",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="border-[#4B006E]/10 bg-white/80">
        <CardHeader>
          <CardTitle className="text-[#4B006E]">Informações pessoais</CardTitle>
          <CardDescription>Confira seus dados básicos cadastrados na plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[#4B006E]">
          <div>
            <p className="text-xs uppercase text-[#4B006E]/70">Nome</p>
            <p className="text-base font-semibold">{session?.user?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[#4B006E]/70">E-mail</p>
            <p className="text-base font-semibold">{session?.user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[#4B006E]/70">Função</p>
            <p className="text-base font-semibold">{session?.user?.role === "ADMIN" ? "Administrador" : "Produtor"}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-[#4B006E]/10 bg-white/80">
        <CardHeader>
          <CardTitle className="text-[#4B006E]">Próximos passos</CardTitle>
          <CardDescription>
            Receba atualizações sobre novas coletas, produtos digitais e oportunidades com parceiros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[#4B006E]/80">
          <p>• Mantenha seus dados atualizados para facilitar a logística de coleta.</p>
          <p>• Explore os produtos da Hotmart e compartilhe com sua equipe.</p>
          <p>• Fique de olho nas notificações por e-mail enviadas pela equipe Açaí Leads.</p>
        </CardContent>
      </Card>
    </div>
  );
}