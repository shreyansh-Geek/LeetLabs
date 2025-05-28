import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"LeetLabs" <${process.env.SMTP_SENDEREMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage,
    };    
    await transporter.sendMail(mailOptions);
};