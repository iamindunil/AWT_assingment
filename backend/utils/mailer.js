import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationCode = (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code for Your Book Manager Account',
        text: `Dear user,\n\nPlease use the following verification code to verify your email address.\n\nCode: ${code}\n\nBest regards,\nBook Manager Team`,
    };

    // Send the email
    return transporter.sendMail(mailOptions);
};

export {sendVerificationCode};
