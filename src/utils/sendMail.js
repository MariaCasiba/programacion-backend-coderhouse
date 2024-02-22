import nodemailer from 'nodemailer';
import { configObject } from '../config/index.js';
import __dirname from './index.js';

const transport = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_pass_app
    }
})

/*
export const sendMail = async (destino, subjet, html) => {
    return await transport.sendMail({
        from: 'Este mail lo envía <projecto_ecommerce@gmail.com>',
        to: 'projecto_ecommerce@gmail.com',
        subject: 'Enviando email de prueba',
        html:`<div>
            <h1>Email de prueba</h1>
        </div>`
    })
}
*/


// dinámico - con attachment
export const sendMail = async (destino, subject, html) => {
    return await transport.sendMail({
        from: 'Este mail lo envía <casibamariaines@gmail.com>',
        to: destino,
        subject,
        html,
        attachments: [{
            filename: '',
            path: __dirname + '/public/images/googlelogo.png',
            cid: 'google logo' //nombre de la imagen
        }]
    })
}

