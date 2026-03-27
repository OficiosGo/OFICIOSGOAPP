import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "OficiosGo! <onboarding@resend.dev>",
    to: email,
    subject: "Recuperar contraseña - OficiosGo!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: #1A1D2E; padding: 12px 24px; border-radius: 12px;">
            <span style="color: #F8C927; font-size: 24px; font-weight: 900;">OficiosGo!</span>
          </div>
        </div>
        <h2 style="color: #1A1D2E; font-size: 20px; margin-bottom: 12px;">Recuperar contraseña</h2>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Recibimos una solicitud para cambiar tu contraseña. Tocá el botón para crear una nueva:
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${resetUrl}" style="display: inline-block; background: #F8C927; color: #1A1D2E; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 15px; text-decoration: none;">
            Cambiar mi contraseña
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 12px; line-height: 1.5;">
          Este link expira en 1 hora. Si no pediste cambiar tu contraseña, ignorá este email.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 11px; text-align: center;">
          OficiosGo! — Profesionales de oficios en Villa María, Córdoba
        </p>
      </div>
    `,
  });
}