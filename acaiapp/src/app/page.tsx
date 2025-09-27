import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const benefits = [
  {
    title: "Economize",
    description:
      "Reduza custos com descarte e transforme um passivo em receita recorrente para o seu negócio.",
  },
  {
    title: "Monetize",
    description:
      "Receba por cada carga recolhida e acompanhe novas oportunidades digitais no mercado de açaí.",
  },
  {
    title: "Ajude o Meio Ambiente",
    description:
      "Contribua para um destino sustentável dos caroços de açaí e fortaleça a economia circular da região.",
  },
];

const testimonials = [
  {
    name: "Francisca Almeida",
    role: "Produtora em Belém",
    quote:
      "Antes eu pagava para descartar os caroços. Agora recebo e ainda tenho acesso a conteúdos que me ajudam a vender mais.",
  },
  {
    name: "Diego Souza",
    role: "Cooperativa Verde",
    quote:
      "A plataforma é simples, intuitiva e trouxe novos parceiros para a nossa cadeia do açaí.",
  },
];

const partnerLogos = [
  "Cooperativas do Norte",
  "Açaí Brasil",
  "Selo Verde Amazônia",
  "Rede Sustenta",
];

const productHighlights = [
  "Listas exclusivas de fornecedores e compradores",
  "Planilhas financeiras para otimizar o transporte",
  "Mentorias e workshops com especialistas do mercado",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-white to-[#f3e8ff]">
      <section className="relative px-6 pb-24 pt-24 lg:px-24">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary">Plataforma exclusiva para produtores de açaí</Badge>
            <h1 className="text-4xl font-bold text-[#4B006E] sm:text-5xl lg:text-6xl">
              Transforme caroço de açaí em dinheiro. Nós pagamos para recolher o que antes custava para você descartar.
            </h1>
            <p className="text-lg text-[#4B006E]/80 sm:text-xl">
              Trabalhamos com uma rede de fornecedores certificados, logística ágil e conteúdos digitais que aceleram a sua
              operação. Cadastre-se e descubra oportunidades exclusivas no mercado do açaí.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="bg-[#4B006E] hover:bg-[#35004f] px-8 py-6 text-base">
                <Link href="/auth/register">Acesse a Plataforma</Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                Sem burocracia. Cadastro em menos de 2 minutos.
              </span>
            </div>
          </div>
          <div className="relative flex flex-col gap-4 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
            <div className="rounded-2xl bg-[#4B006E] p-6 text-white shadow-lg">
              <p className="text-lg font-semibold">Nós buscamos, você recebe.</p>
              <p className="mt-2 text-sm text-white/80">
                Pagamos fornecedores e produtores parceiros para recolher os caroços e dar o destino sustentável que eles merecem.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[#4B006E]">
              <div className="rounded-xl bg-[#F5F5DC] p-4 text-center shadow-sm">
                <p className="text-3xl font-bold">+120</p>
                <p className="text-sm">parceiros remunerados</p>
              </div>
              <div className="rounded-xl bg-[#F5F5DC] p-4 text-center shadow-sm">
                <p className="text-3xl font-bold">24h</p>
                <p className="text-sm">para coleta na sua porta</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-3xl font-bold">Hotmart</p>
                <p className="text-sm">produtos curados</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-3xl font-bold">+R$ 300k</p>
                <p className="text-sm">em receitas geradas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-24">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-[#4B006E]/10 bg-white/80">
              <CardHeader>
                <CardTitle className="text-xl text-[#4B006E]">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-[#4B006E]/80">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#4B006E] px-6 py-20 text-white lg:px-24">
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold sm:text-4xl">Ganhe acesso a produtos digitais estratégicos</h2>
            <p className="text-lg text-white/80">
              Nossa curadoria no Hotmart conecta você a treinamentos, listas de fornecedores e ferramentas que aceleram o
              crescimento do seu negócio de açaí.
            </p>
            <ul className="space-y-3 text-sm sm:text-base">
              {productHighlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Prova social</h3>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-white/20 bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="text-sm text-white/70">
                      {testimonial.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/90">“{testimonial.quote}”</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-24">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#4B006E]">
            Parceiros que confiam na nossa operação
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="rounded-xl border border-[#4B006E]/10 bg-white/70 px-6 py-8 text-sm font-semibold text-[#4B006E]/80 shadow-sm"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-[#4B006E] px-8 py-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pronto para transformar resíduo em lucro?
          </h2>
          <p className="max-w-3xl text-base text-white/80">
            Cadastre-se e descubra oportunidades exclusivas no mercado do açaí. Receba por cada coleta e tenha acesso imediato à
            nossa plataforma com produtos Hotmart selecionados.
          </p>
          <Button asChild className="bg-white text-[#4B006E] hover:bg-[#F5F5DC]">
            <Link href="/auth/register">Acesse a Plataforma</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}