import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"LeetLabs" <${process.env.MAILTRAP_SENDEREMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage,
    };    
    await transporter.sendMail(mailOptions);
};