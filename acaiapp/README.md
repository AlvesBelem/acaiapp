# Açaí Leads SaaS

Plataforma SaaS para produtores e fornecedores de açaí monetizarem o descarte de caroços. O projeto oferece landing page impactante, autenticação completa, dashboard com produtos digitais (Hotmart) e painel administrativo para gestão de usuários, leads e produtos.

## Stack

- [Next.js 15 (App Router, TypeScript)](https://nextjs.org/)
- [Tailwind CSS + shadcn/ui components](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/) + [PostgreSQL (Neon)](https://neon.tech/)
- [NextAuth.js (Credentials + Google OAuth)](https://next-auth.js.org/)
- [Resend](https://resend.com/) para e-mails transacionais
- Deploy recomendado: [Vercel](https://vercel.com/) + Neon

## Funcionalidades

- **Landing page** minimalista com copy focada em monetização de caroços.
- **Cadastro/Login** com credenciais ou Google, integração automática com a tabela de leads.
- **Dashboard** com cards de produtos digitais (links Hotmart).
- **Perfil do usuário** com dados básicos.
- **Admin Panel** exclusivo para `ADMIN` com:
  - CRUD de produtos digitais (criar, editar, remover).
  - Exportação de usuários e leads em CSV.
  - Visão geral de usuários/leads cadastrados.
- **Seeds** iniciais: 1 admin, 2 usuários demo, 2 produtos.

## Configuração local

1. **Clone o repositório e instale as dependências**

   ```bash
   npm install
   ```

2. **Variáveis de ambiente**

   Crie um arquivo `.env` na raiz com os valores abaixo (use `.env.example` como referência):

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="sua-chave-secreta"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   RESEND_API_KEY="..."
   ```

   - Gere o banco no [Neon](https://neon.tech/) e substitua `DATABASE_URL`.
   - Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/) para OAuth.
   - Crie uma API key no [Resend](https://resend.com/).

3. **Prepare o banco**

   ```bash
   npm run db:push      # aplica o schema Prisma no banco
   npm run db:seed      # cria usuários, leads e produtos demo
   ```

   > Se estiver em ambiente sem acesso aos binários Prisma, use `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` ao executar comandos Prisma.

4. **Execute a aplicação**

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Usuários seed

| Tipo   | E-mail           | Senha     |
| ------ | ---------------- | --------- |
| Admin  | `admin@acai.com` | `admin123`|
| Usuário| `paulo@acai.com` | `senha123`|
| Usuário| `ana@acai.com`   | `senha123`|

## Deploy (Vercel + Neon)

1. Crie um projeto no Neon e configure a URL em `DATABASE_URL` com SSL habilitado.
2. No painel da Vercel, importe este repositório e defina as variáveis de ambiente:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (ex.: `https://seu-domínio.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
   - `RESEND_API_KEY`
3. Configure o OAuth do Google com as URLs de callback da Vercel (`https://seu-domínio.vercel.app/api/auth/callback/google`).
4. Após o deploy, execute os comandos Prisma (via terminal da Vercel ou GitHub Actions) para aplicar o schema e rodar os seeds:

   ```bash
   npm run db:push
   npm run db:seed
   ```

## Estrutura de Pastas

```
src/
  app/
    (platform)/...    # Áreas logadas (dashboard, perfil, admin)
    auth/...          # Páginas de login e cadastro
    api/...           # Rotas Next.js (auth, register, produtos, export)
    page.tsx          # Landing page
  components/
    platform/...      # Componentes específicos da plataforma/admin
    ui/...            # Componentes shadcn/ui reutilizáveis
  lib/
    actions/          # Regras de negócio (ex.: cadastro)
    prisma.ts         # Conexão Prisma
    auth.ts           # Configurações NextAuth
    mail.ts           # Cliente Resend
    utils.ts          # Helpers (cn)
```

## Hotmart & Resend

- Os botões "Comprar agora" abrem diretamente os links externos do Hotmart.
- E-mails de boas-vindas são enviados via Resend quando novos cadastros são criados (se a API key estiver configurada).

## Observações

- A paleta utiliza roxo açaí (`#4B006E`/`#6A0DAD`), bege claro (`#F5F5DC`) e branco.
- O middleware protege rotas `/dashboard`, `/profile` e `/admin`.
- O painel Admin exige usuário com `role = ADMIN`.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
