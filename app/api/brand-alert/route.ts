import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { site, fullUrl, reason } = await req.json();

    const user = process.env.EMAIL_USER;
    const appPassword = process.env.EMAIL_APP_PASSWORD;
    const to = process.env.ALERT_TO;

    if (!user || !appPassword || !to) {
      return NextResponse.json(
        { error: "Missing email environment variables." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass: appPassword
      }
    });

    await transporter.sendMail({
      from: `"Via Browser Extension" <${user}>`,
      to,
      subject: `🚨 Unsupported Brand Request`,
      text: `A user attempted to use your browser extension on the following site: ${site}`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}