import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const geistSans = GeistSans;

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: "Açaí Leads | Monetize seus caroços de açaí",
    template: "%s | Açaí Leads",
  },
  description:
    "Nós pagamos para recolher o caroço de açaí e entregamos conteúdos digitais exclusivos para produtores e fornecedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}