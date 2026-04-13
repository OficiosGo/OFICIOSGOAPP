import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { withErrorHandling } from "@/lib/api-handler";
import { registerSchema } from "@/lib/validators";
import { authService } from "@/server/services/auth.service";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", code: "VALIDATION", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { token, user } = await authService.register(parsed.data);

  // Email de bienvenida — no bloqueamos el registro si falla
  resend.emails.send({
    from: "Santiago Ramírez <hola@oficiosgo.com>",
    to: user.email,
    subject: "¡Bienvenido a OficiosGo! 🎉",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#F4F4F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:#1A1D2E;padding:32px 40px;text-align:center;">
                    <div style="font-size:28px;font-weight:900;color:#F8C927;letter-spacing:-0.5px;">OficiosGo!</div>
                    <div style="font-size:12px;color:#9CA3AF;margin-top:4px;">Conectamos profesionales con clientes</div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 40px 32px;">
                    <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1A1D2E;">
                      ¡Hola, ${user.name.split(" ")[0]}! 👋
                    </p>
                    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
                      Gracias por unirte a <strong>OficiosGo!</strong> — la plataforma que conecta profesionales de oficios con clientes en Villa María y Villa Nueva.
                    </p>

                    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#92400E;">📋 Próximos pasos</p>
                      <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;color:#78350F;line-height:1.8;">
                        <li>Completá tu perfil con foto y descripción</li>
                        <li>Agregá fotos de tus trabajos</li>
                        <li>Esperá la aprobación (menos de 24hs)</li>
                        <li>¡Empezá a recibir clientes!</li>
                      </ul>
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="https://www.oficiosgo.com/app/cuenta/editar"
                            style="display:inline-block;background:#F8C927;color:#1A1D2E;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                            Completar mi perfil →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="border-top:1px solid #F3F4F6;"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
                      Este mensaje fue enviado por <strong style="color:#1A1D2E;">Santiago Ramírez</strong>, creador de OficiosGo!<br/>
                      Si tenés alguna duda respondé este email o escribinos por WhatsApp.
                    </p>
                    <p style="margin:12px 0 0;font-size:12px;color:#D1D5DB;">
                      © 2025 OficiosGo! — Villa María, Córdoba, Argentina
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }).catch((err) => {
    console.error("Error enviando email de bienvenida:", err);
  });

  const response = NextResponse.json({ data: user }, { status: 201 });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
});