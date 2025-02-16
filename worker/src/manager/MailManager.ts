import nodemailer from 'nodemailer';

export class MailManager{
    private static instance: MailManager;

    private constructor(){}

    public static getInstance(): MailManager{
        if(this.instance === undefined){
            return this.instance = new MailManager();
        }
        return this.instance;
    }

    public sendMail(to: string, subject: string, html: string){
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: to,
            subject: subject,
            html: html
        };

        transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}