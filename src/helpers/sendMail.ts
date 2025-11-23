// src/utils/sendVerificationEmail.ts
import sgMail from "@sendgrid/mail";
import { renderTemplate } from "./renderTemplate";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type SendOpts = {
  to: string;
  subject: string;
  htmlTemplate: string;
  variables: Record<string, any>;
};

export async function sendVerificationEmail({
  to,
  subject,
  htmlTemplate,
  variables,
}: SendOpts) {
  try {
    const html = renderTemplate(htmlTemplate, variables);

    const msg = {
      to,
      from: process.env.FROM_EMAIL!, // verified sender in SendGrid
      subject,
      html,
    };

    const sent = await sgMail.send(msg);
    console.log("Email sent:", sent);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
