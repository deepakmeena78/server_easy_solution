import nodemailer from 'nodemailer';

export class Helpers {
    async sendMail(data, template) {
        const transporter = nodemailer.createTransport({
            port: process.env.EMAIL_PORT || 465,
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            auth: {
                user: process.env.ADMIN_EMAIL || 'deepakmeenaa78@gmail.com',
                pass: process.env.EMAIL_APP_PASSWOD || 'qroe gkeg bhci ekyw',
            },
            secure: true,
        });

        const mailData = {
            from: process.env.ADMIN_EMAIL || "deepakmeenaa78@gmail.com",
            to: data.email,
            subject: data.subject,
            html: template
        };
 
        transporter.sendMail(mailData, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
        return
    }


    generateOtp(limit, type = "digit") {
        let characters = "0123456789";
        if (type === "string") {
            characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        }
        let otp = "";
        for (let i = 0; i < limit; i++) {
            otp += characters[Math.floor(Math.random() * characters.length)];
        }
        return otp;
    }



    uploadImage(gallery) {

        const storage = multer.diskStorage({
            destination: './uploads/',
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        return storage;
    }
}
