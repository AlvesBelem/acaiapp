import NextAuth, { type NextAuthConfig } from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Email e senha são obrigatórios");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
          throw new Error("Credenciais inválidas");
        }

        const authenticatedUser: NextAuthUser = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        return authenticatedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id as string },
        });

        token.role = existingUser?.role ?? "USER";
      } else if (token.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (existingUser) {
          token.role = existingUser.role;
        }
      }

      if (account?.provider === "google" && token.email) {
        const userInDb = await prisma.user.upsert({
          where: { email: token.email },
          update: {},
          create: {
            email: token.email,
            name: token.name ?? "Usuário Google",
            password: null,
          },
        });

        await prisma.lead.upsert({
          where: { email: userInDb.email },
          update: { name: userInDb.name },
          create: {
            email: userInDb.email,
            name: userInDb.name,
            userId: userInDb.id,
          },
        });

        token.sub = userInDb.id;
        token.role = userInDb.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email || !user.name) return;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!dbUser) return;

      await prisma.lead.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: {
          email: user.email,
          name: user.name,
          userId: dbUser.id,
        },
      });
    },
  },
};

const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export { auth, signIn, signOut };
export const { GET, POST } = handlers;