import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const registerSchema = z.object({
  name: z.string().min(2, "Informe um nome válido"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(values: RegisterInput) {
  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    } as const;
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return {
      success: false,
      message: "E-mail já cadastrado. Faça login ou recupere sua senha.",
    } as const;
  }

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  await prisma.lead.upsert({
    where: { email },
    update: { name },
    create: {
      email,
      name,
      userId: user.id,
    },
  });

  await sendEmail({
    to: email,
    subject: "Bem-vindo à plataforma de oportunidades do açaí",
    html: `<h1>Bem-vindo, ${name}!</h1><p>Você agora faz parte da rede que monetiza caroços de açaí e acessa conteúdos exclusivos do setor.</p>`,
  });

  return {
    success: true,
    user,
  } as const;
}