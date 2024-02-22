import { Router } from "express";
import { sendSms } from "../../utils/sendSMS.js";

const smsRouter = Router();

smsRouter.get("/sendsms", (req, res) => {
    sendSms(`Bienvenido`, {first_name: 'Maria', last_name: 'Casiba', phone: '+54 264 586 1242'})
    res.send('SMS enviado')
})


export default smsRouter


