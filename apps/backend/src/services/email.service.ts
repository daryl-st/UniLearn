import nodemailer, { type SendMailOptions } from "nodemailer";

export class EmailServiceNotConfiguredError extends Error {
    constructor() {
        super("Email service is not configured. Set BREVO_EMAIL, BREVO_SMTP_KEY, and FROM_EMAIL.");
        this.name = "EmailServiceNotConfiguredError";
    }
}

export class EmailServiceDeliveryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmailServiceDeliveryError";
    }
}

const BREVO_EMAIL = process.env.BREVO_EMAIL?.trim() ?? "";
const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY?.trim() ?? "";
const FROM_EMAIL = process.env.FROM_EMAIL?.trim() ?? "";

function getTransporter() {
    if (!BREVO_EMAIL || !BREVO_SMTP_KEY || !FROM_EMAIL) {
        throw new EmailServiceNotConfiguredError();
    }

    return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: BREVO_EMAIL,
            pass: BREVO_SMTP_KEY,
        },
    });
}

export async function sendEmail(options: SendMailOptions): Promise<void> {
    const transporter = getTransporter();

    try {
        await transporter.sendMail({
            ...options,
            from: FROM_EMAIL,
        });
        console.info(`[EmailService] Sent email to ${options.to}`);
    } catch (error) {
        console.error("[EmailService] Failed to send email", error);
        throw new EmailServiceDeliveryError(
            error instanceof Error ? error.message : "Failed to send email via Brevo SMTP.",
        );
    }
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="margin: 0; font-size: 28px; color: #0f172a;">UniLearn</h1>
                <p style="margin: 8px 0 0; color: #475569;">Welcome to UniLearn</p>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
                <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Verify Your UniLearn Account</h2>
                <p style="color: #475569; line-height: 1.6;">Welcome to UniLearn. Please verify your email to activate your account.</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 24px; background: #2563eb; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Your Email</a>
                </div>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6;">If the button above does not work, copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; color: #0f172a; font-size: 14px;">${verifyUrl}</p>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">If you did not create this account, you can safely ignore this email.</p>
            </div>
        </div>
    `;

    await sendEmail({
        to,
        subject: "Verify Your UniLearn Account",
        html,
        text: `Welcome to UniLearn. Please verify your email by visiting the link below:\n\n${verifyUrl}`,
    });
}
