import nodemailer from "nodemailer";

// Module-level singleton - avoid opening a new SMTP connection per request.
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    return transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
}
