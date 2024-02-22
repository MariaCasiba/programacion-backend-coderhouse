import twilio from "twilio"
import { configObject } from '../config/index.js';

const { twilio_account_sid, twilio_auth_token, twilio_phone_number } = configObject

const client = twilio(twilio_account_sid, twilio_auth_token)


export const sendSms = (body, user) => client.messages.create({
    body: body + ' ' + user.first_name + ' ' + user.last_name,
    from: twilio_phone_number,
    to: user.phone
}) 