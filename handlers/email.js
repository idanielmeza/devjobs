const emailConfig = require('../config/mail');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

let transport = nodemailer.createTransport(emailConfig);

//utilizar templates de handelbars
transport.use('compila',hbs({
    viewEngine: 'handlebars',
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars'
}))

const enviarEmail = async(opciones)=>{
    const opcionesEmail = {
        from: 'devJobs <noreply@devjobs.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }
    }

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail);

}



module.exports = {
    enviarEmail
}