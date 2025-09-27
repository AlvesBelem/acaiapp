import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Camila Souza",
      email: "admin@acai.com",
      password,
      role: "ADMIN",
    },
  });

  await prisma.lead.create({
    data: {
      name: admin.name,
      email: admin.email,
      userId: admin.id,
    },
  });

  const demoUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Paulo Lima",
        email: "paulo@acai.com",
        password: await hash("senha123", 10),
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Pereira",
        email: "ana@acai.com",
        password: await hash("senha123", 10),
        role: "USER",
      },
    }),
  ]);

  await prisma.lead.createMany({
    data: demoUsers.map((user) => ({
      name: user.name,
      email: user.email,
      userId: user.id,
    })),
  });

  await prisma.product.createMany({
    data: [
      {
        title: "Guia de Fornecedores Premium do Açaí",
        description:
          "Lista atualizada com fornecedores certificados, contatos exclusivos e condições especiais para parceiros.",
        hotmartUrl: "https://pay.hotmart.com/guia-premium-acai",
        imageUrl:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Workshop Logística Lucrativa do Caroço",
        description:
          "Treinamento completo com planilhas, roteiros de coleta e estratégias para maximizar ganhos com logística reversa.",
        hotmartUrl: "https://pay.hotmart.com/workshop-logistica-acai",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });