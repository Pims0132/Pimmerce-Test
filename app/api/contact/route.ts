import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const dienstLabels: Record<string, string> = {
  website:        'Volledige website',
  'ai-marketing': 'AI Marketing',
  ecommerce:      'E-commerce optimalisatie',
  anders:         'Anders / Nog niet zeker',
}

export async function POST(req: NextRequest) {
  try {
    const { naam, email, bedrijf, dienst, bericht } = await req.json()

    if (!naam || !email) {
      return NextResponse.json({ error: 'Naam en email zijn verplicht' }, { status: 400 })
    }

    // 1. Opslaan in Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabase
      .from('contacten')
      .insert([{ naam, email, bedrijf, dienst, bericht }])

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Database fout' }, { status: 500 })
    }

    const dienstLabel = dienstLabels[dienst] || dienst

    // 2. Bevestigingsmail naar bezoeker
    await resend.emails.send({
      from: 'Pim van Pimmerce <info@pimmerce.com>',
      to: email,
      subject: `Bedankt voor je aanvraag, ${naam}!`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="nl">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; background-color: #020b14; }
    @media screen and (max-width: 600px) {
      .wrapper { width: 100% !important; max-width: 100% !important; }
      .header-td { padding: 28px 24px 24px !important; }
      .body-td { padding: 28px 24px !important; }
      .footer-td { padding: 20px 24px !important; }
      .greeting { font-size: 20px !important; }
      .btn a { padding: 13px 24px !important; font-size: 13px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#020b14;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#020b14;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table class="wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="580" style="max-width:580px;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#040f1c;border-radius:20px 20px 0 0;border:1px solid #1a2a3a;border-bottom:none;overflow:hidden;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="height:2px;background:linear-gradient(90deg,#020b14,#0affcb,#020b14);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="header-td" align="center" style="padding:36px 40px 28px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="width:52px;height:52px;background-color:#0d2e26;border:1px solid #1a4a3a;border-radius:14px;font-size:22px;line-height:52px;vertical-align:middle;">⚡</td>
                      </tr>
                    </table>
                    <p style="margin:14px 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:-1px;color:#0affcb;line-height:1;">Pimmerce</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3d5a73;line-height:1;">AI &nbsp;·&nbsp; Webdesign &nbsp;·&nbsp; E-commerce</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#040f1c;border-left:1px solid #1a2a3a;border-right:1px solid #1a2a3a;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="body-td" style="padding:36px 40px 32px;">

                    <p class="greeting" style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;color:#e8f0fe;letter-spacing:-0.5px;line-height:1.2;">Hey ${naam}! 👋</p>

                    <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:300;color:#6a89aa;line-height:1.8;">
                      Bedankt voor je aanvraag. Ik heb je bericht goed ontvangen en neem zo snel mogelijk &mdash;
                      <span style="color:#e8f0fe;font-weight:600;">uiterlijk binnen 24 uur</span>
                      &mdash; contact met je op.
                    </p>

                    <!-- Aanvraag card -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#071620;border:1px solid #1a3a2a;border-radius:16px;margin-bottom:28px;">
                      <tr>
                        <td style="width:3px;background-color:#0affcb;border-radius:16px 0 0 16px;font-size:0;">&nbsp;</td>
                        <td style="padding:22px 24px;">
                          <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0affcb;line-height:1;">Jouw aanvraag</p>

                          ${dienst ? `
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
                            <tr>
                              <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#3d5a73;width:70px;vertical-align:middle;padding:4px 0;">Dienst</td>
                              <td style="padding:4px 0;vertical-align:middle;">
                                <span style="display:inline-block;background-color:#0d2e26;border:1px solid #1a4a3a;color:#0affcb;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;">${dienstLabel}</span>
                              </td>
                            </tr>
                          </table>` : ''}

                          ${bedrijf ? `
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:18px;">
                            <tr>
                              <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#3d5a73;width:70px;vertical-align:middle;padding:4px 0;">Bedrijf</td>
                              <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#e8f0fe;font-weight:500;padding:4px 0;">${bedrijf}</td>
                            </tr>
                          </table>` : ''}

                          ${bericht ? `
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="height:1px;background-color:#1a2a3a;font-size:0;line-height:0;margin-bottom:16px;">&nbsp;</td>
                            </tr>
                          </table>
                          <p style="margin:16px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3d5a73;line-height:1;">Jouw bericht</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width:3px;background-color:#0affcb;border-radius:2px;font-size:0;">&nbsp;</td>
                              <td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-style:italic;color:#8a9ab0;line-height:1.7;">&ldquo;${bericht}&rdquo;</td>
                            </tr>
                          </table>` : ''}

                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;color:#6a89aa;line-height:1.8;">
                      Heb je in de tussentijd vragen? Mail me gerust op
                      <a href="mailto:info@pimmerce.com" style="color:#0affcb;text-decoration:none;font-weight:500;">info@pimmerce.com</a>.
                    </p>

                    <table class="btn" role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color:#0affcb;border-radius:999px;">
                          <a href="https://pimmerce.com" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#020b14;text-decoration:none;border-radius:999px;letter-spacing:0.3px;">Bekijk pimmerce.com &rarr;</a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#020b14;border:1px solid #1a2a3a;border-top:none;border-radius:0 0 20px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="footer-td" align="center" style="padding:22px 40px;">
                    <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#2a3a4a;"">Pimmerce</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#1e2e3e;line-height:1.7;">
                      &copy; ${new Date().getFullYear()} Pimmerce &mdash; Tilburg, Nederland<br />
                      <a href="https://pimmerce.com" style="color:#1a4a3a;text-decoration:none;">pimmerce.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    // 3. Notificatiemail naar jou
    await resend.emails.send({
      from: 'Pimmerce Dashboard <info@pimmerce.com>',
      to: process.env.RESEND_TO_EMAIL!,
      subject: `⚡ Nieuwe aanvraag van ${naam}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="nl">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style type="text/css">
    body { margin: 0 !important; padding: 0 !important; background-color: #020b14; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#020b14;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#020b14;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="520" style="max-width:520px;background-color:#040f1c;border:1px solid #1a2a3a;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,#020b14,#0affcb,#020b14);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:900;color:#e8f0fe;">⚡ Nieuwe aanvraag</p>
              <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#3d5a73;font-family:Arial,Helvetica,sans-serif;font-size:13px;width:80px;">Naam</td>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#e8f0fe;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;">${naam}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#3d5a73;font-family:Arial,Helvetica,sans-serif;font-size:13px;">E-mail</td>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                    <a href="mailto:${email}" style="color:#0affcb;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                ${bedrijf ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#3d5a73;font-family:Arial,Helvetica,sans-serif;font-size:13px;">Bedrijf</td>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#e8f0fe;font-family:Arial,Helvetica,sans-serif;font-size:13px;">${bedrijf}</td>
                </tr>` : ''}
                ${dienst ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;color:#3d5a73;font-family:Arial,Helvetica,sans-serif;font-size:13px;">Dienst</td>
                  <td style="padding:10px 0;border-bottom:1px solid #1a2a3a;">
                    <span style="display:inline-block;background-color:#0d2e26;border:1px solid #1a4a3a;color:#0affcb;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;">${dienstLabel}</span>
                  </td>
                </tr>` : ''}
                ${bericht ? `<tr>
                  <td colspan="2" style="padding:16px 0 0;">
                    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3d5a73;">Bericht</p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width:3px;background-color:#0affcb;border-radius:2px;font-size:0;">&nbsp;</td>
                        <td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-style:italic;color:#8a9ab0;line-height:1.7;">&ldquo;${bericht}&rdquo;</td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ''}
              </table>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="background-color:#0affcb;border-radius:999px;">
                    <a href="mailto:${email}?subject=Re: Jouw aanvraag bij Pimmerce" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#020b14;text-decoration:none;border-radius:999px;">Direct beantwoorden &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server fout' }, { status: 500 })
  }
}
