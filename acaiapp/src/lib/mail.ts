import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("Resend API key não configurada.");
    return;
  }

  await resend.emails.send({
    from: "Açaí Leads <noreply@acaiapp.com>",
    to,
    subject,
    html,
  });
}