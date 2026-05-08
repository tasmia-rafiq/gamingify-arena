// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendMail = async ({ to, subject, html }) => {
//     try {
//         await resend.emails.send({
//             from: process.env.EMAIL_FROM,
//             to,
//             subject,
//             html
//         });

//         console.log("Email sent via Resend:", to);
//     } catch (error) {
//         console.log("Resend email error:", error);
//         throw error;
//     }
// };

// export default sendMail;

import { createTransport } from "nodemailer";

const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailData = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
        console.log("Email sent via Nodemailer to:", mailData.to);
      }
    });
  });
};

export default sendMail;
