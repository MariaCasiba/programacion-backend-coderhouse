import { Router } from "express";
import { sendMail } from "../../utils/sendMail.js"

const emailRouter = Router()

emailRouter.get('/sendmail', (req, res) => {
    const user = {
        email: 'casibamariaines@gmail.com',
        first_name: 'Maria',
        last_name: 'Casiba'
    }
    const to = user.email
    const subject = 'Esto es un email de prueba'
    const html = `<div>
        <h2>Bienvenido a prueba de email ${user.first_name} ${user.last_name}</h2>
    </div>`
    sendMail(to, subject, html) 
    res.send('mail enviado')
})

export default emailRouter;
