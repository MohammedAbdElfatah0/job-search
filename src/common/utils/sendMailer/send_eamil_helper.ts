import { ConflictException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendEmailHelper({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
    const service = process.env.EMAIL_SERVICE;
    const user = process.env.EMAIL_USER || process.env.USER_EMAIL;
    const pass = process.env.EMAIL_PASSWORD || process.env.PASSWORD_EMAIL;

    if (!user || !pass) {
        throw new ConflictException('Email credentials are missing (user/pass)');
    }

    let transportOptions: SMTPTransport.Options;
    if (service) {
        transportOptions = {
            service,
            auth: { user, pass },
        };
    } else if (host && port) {
        transportOptions = {
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        };
    } else {
        throw new ConflictException('Email transport is not configured: provide EMAIL_SERVICE or EMAIL_HOST and EMAIL_PORT');
    }

    const transporter = nodemailer.createTransport(transportOptions as SMTPTransport.Options);

    await transporter.sendMail({
        from: `JobSearch <${user}>`,
        to,
        subject,
        html,
    });
}
