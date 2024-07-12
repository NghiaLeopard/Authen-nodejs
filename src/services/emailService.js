const nodemailer = require("nodemailer");

const emailService = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: `Để biết mật khẩu hiện tại của bạn, Vui lòng click vào link phía dưới.`,
        text: `Click vào đường link sau để đặt lại mật khẩu: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("mail error", err);
        }

        console.log("mail success", info);
    });
};

module.exports = emailService;
