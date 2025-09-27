import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaStubWarningLogged = false;

const createPrismaClient = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("@prisma/client did not initialize yet")) {
      if (!prismaStubWarningLogged) {
        console.warn(
          "@prisma/client não foi gerado. Usando dados mockados apenas para desenvolvimento. Execute `npx prisma generate` e `npm run db:seed` quando tiver acesso ao banco."
        );
        prismaStubWarningLogged = true;
      }
      return createPrismaStub();
    }
    throw error;
  }
};

const prismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;

/* eslint-disable @typescript-eslint/no-explicit-any */
function createPrismaStub() {
  type Role = "ADMIN" | "USER";

  const now = new Date("2024-01-01T12:00:00Z");
  type StubUser = {
    id: string;
    name: string;
    email: string;
    password: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };

  type StubLead = {
    id: string;
    name: string;
    email: string;
    userId: string;
    createdAt: Date;
  };

  type StubProduct = {
    id: string;
    title: string;
    description: string;
    hotmartUrl: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const users: StubUser[] = [
    {
      id: "stub-user-admin",
      name: "Camila Souza",
      email: "admin@acai.com",
      password: "$2a$10$Ef/886TJCGAZdxeWS7i9YeCtdAY7gwHCj08QpTjTQGoIVYj4tw7/i",
      role: "ADMIN" as Role,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "stub-user-paulo",
      name: "Paulo Lima",
      email: "paulo@acai.com",
      password: "$2a$10$/JEJbF9Ppd6pGIT/qt9jEuWfZF7G.MLAtig5K3W59pbvEjayyOOPq",
      role: "USER" as Role,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "stub-user-ana",
      name: "Ana Pereira",
      email: "ana@acai.com",
      password: "$2a$10$/JEJbF9Ppd6pGIT/qt9jEuWfZF7G.MLAtig5K3W59pbvEjayyOOPq",
      role: "USER" as Role,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const leads: StubLead[] = [
    {
      id: "stub-lead-admin",
      name: "Camila Souza",
      email: "admin@acai.com",
      userId: "stub-user-admin",
      createdAt: now,
    },
    {
      id: "stub-lead-paulo",
      name: "Paulo Lima",
      email: "paulo@acai.com",
      userId: "stub-user-paulo",
      createdAt: now,
    },
    {
      id: "stub-lead-ana",
      name: "Ana Pereira",
      email: "ana@acai.com",
      userId: "stub-user-ana",
      createdAt: now,
    },
  ];

  const products: StubProduct[] = [
    {
      id: "stub-product-guia",
      title: "Guia de Fornecedores Premium do Açaí",
      description:
        "Lista atualizada com fornecedores certificados, contatos exclusivos e condições especiais para parceiros.",
      hotmartUrl: "https://pay.hotmart.com/guia-premium-acai",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "stub-product-workshop",
      title: "Workshop Logística Lucrativa do Caroço",
      description:
        "Treinamento completo com planilhas, roteiros de coleta e estratégias para maximizar ganhos com logística reversa.",
      hotmartUrl: "https://pay.hotmart.com/workshop-logistica-acai",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const sortByDate = <T extends { createdAt: Date }>(items: T[], orderBy?: { createdAt?: "asc" | "desc" }) => {
    if (!orderBy?.createdAt) return [...items];
    return [...items].sort((a, b) =>
      orderBy.createdAt === "desc" ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
    );
  };

  const findUser = (where: { id?: string; email?: string }) => {
    if (where.id) {
      return users.find((user) => user.id === where.id) ?? null;
    }
    if (where.email) {
      return users.find((user) => user.email === where.email) ?? null;
    }
    return null;
  };

  const generateId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `stub-${Date.now()}`);

  const prismaStub = {
    user: {
      findUnique: async ({ where }: { where: { id?: string; email?: string } }) => findUser(where) as any,
      findMany: async ({ orderBy }: { orderBy?: { createdAt?: "asc" | "desc" } } = {}) => sortByDate(users, orderBy) as any,
      create: async ({
        data,
      }: {
        data: { name?: string; email: string; password?: string | null; role?: Role };
      }) => {
        const user = {
          id: generateId(),
          name: data.name ?? "Usuário",
          email: data.email,
          password: data.password ?? null,
          role: (data.role ?? "USER") as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(user);
        return user as any;
      },
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: { id?: string; email?: string };
        create: { name?: string; email: string; password?: string | null; role?: Role };
        update: Partial<{ name?: string; password?: string | null; role?: Role }>;
      }) => {
        const existing = findUser(where);
        if (existing) {
          Object.assign(existing, update, { updatedAt: new Date() });
          return existing as any;
        }
        const user = {
          id: generateId(),
          name: create.name ?? "Usuário",
          email: create.email,
          password: create.password ?? null,
          role: (create.role ?? "USER") as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(user);
        return user as any;
      },
      deleteMany: async () => {
        const count = users.length;
        users.length = 0;
        return { count } as any;
      },
    },
    lead: {
      findMany: async ({
        include,
        orderBy,
      }: {
        include?: { user?: boolean };
        orderBy?: { createdAt?: "asc" | "desc" };
      } = {}) => {
        const records = sortByDate(leads, orderBy).map((lead) => ({ ...lead }));
        if (include?.user) {
          return records.map((lead) => ({ ...lead, user: findUser({ id: lead.userId }) })) as any;
        }
        return records as any;
      },
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: { email: string };
        create: { name: string; email: string; userId: string };
        update: Partial<{ name?: string; email?: string; userId?: string }>;
      }) => {
        const existing = leads.find((lead) => lead.email === where.email);
        if (existing) {
          Object.assign(existing, update, { updatedAt: new Date() });
          return existing as any;
        }
        const lead = {
          id: generateId(),
          name: create.name,
          email: create.email,
          userId: create.userId,
          createdAt: new Date(),
        };
        leads.push(lead);
        return lead as any;
      },
      createMany: async ({ data }: { data: Array<{ name: string; email: string; userId: string }> }) => {
        data.forEach((entry) => {
          const lead = {
            id: generateId(),
            name: entry.name,
            email: entry.email,
            userId: entry.userId,
            createdAt: new Date(),
          };
          leads.push(lead);
        });
        return { count: data.length } as any;
      },
      deleteMany: async () => {
        const count = leads.length;
        leads.length = 0;
        return { count } as any;
      },
      create: async ({ data }: { data: { name: string; email: string; userId: string } }) => {
        const lead = {
          id: generateId(),
          name: data.name,
          email: data.email,
          userId: data.userId,
          createdAt: new Date(),
        };
        leads.push(lead);
        return lead as any;
      },
    },
    product: {
      findMany: async ({ orderBy }: { orderBy?: { createdAt?: "asc" | "desc" } } = {}) =>
        sortByDate(products, orderBy) as any,
      create: async ({
        data,
      }: {
        data: { title: string; description: string; hotmartUrl: string; imageUrl: string };
      }) => {
        const product = {
          id: generateId(),
          title: data.title,
          description: data.description,
          hotmartUrl: data.hotmartUrl,
          imageUrl: data.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        products.push(product);
        return product as any;
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<{ title: string; description: string; hotmartUrl: string; imageUrl: string }>;
      }) => {
        const product = products.find((item) => item.id === where.id);
        if (!product) {
          throw new Error("Produto não encontrado (stub)");
        }
        Object.assign(product, data, { updatedAt: new Date() });
        return product as any;
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const index = products.findIndex((item) => item.id === where.id);
        if (index === -1) {
          throw new Error("Produto não encontrado (stub)");
        }
        const [removed] = products.splice(index, 1);
        return removed as any;
      },
      createMany: async ({
        data,
      }: {
        data: Array<{ title: string; description: string; hotmartUrl: string; imageUrl: string }>;
      }) => {
        data.forEach((entry) => {
          const product = {
            id: generateId(),
            title: entry.title,
            description: entry.description,
            hotmartUrl: entry.hotmartUrl,
            imageUrl: entry.imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          products.push(product);
        });
        return { count: data.length } as any;
      },
      deleteMany: async () => {
        const count = products.length;
        products.length = 0;
        return { count } as any;
      },
    },
    $disconnect: async () => {},
    $connect: async () => {},
  };

  return prismaStub as unknown as PrismaClient;
}
/* eslint-enable @typescript-eslint/no-explicit-any */