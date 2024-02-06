const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports.sendMail = async( email, link ) => {
    try {

        let transporter = await nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.nodemailerUser,
                pass: process.env.nodemailerPass,
            }
        })

       let info = await transporter.sendMail({
        from: {
            name: "anything.com",
            address: "geetahunny@gmail.com",
        },
        to: email,
        subject: "email verification by anything.com",
        text: "verify your email for account opening at anything.com",
        html: `<h1>One last step for shopping anything (link only valid till 1 hour)</h1> <a href="${link}">Click here to verify</a><br />`,
       }) 
       return 1
        
    } catch (error) {
        console.log(error);
        return 0
    }
}

