import dotenv from "dotenv";
import { program } from "../utils/commander.js";
import MongoSingleton from "../utils/mongoSingleton.js";

const { mode } = program.opts();
console.log('mode config: ', mode)


dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production",
});

const configObject = {
  PORT: process.env.PORT || 8000,
  mongo_url: process.env.MONGO_URL,
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  gmail_user_app: process.env.GMAIL_USER_APP,
  gmail_pass_app: process.env.GMAIL_PASS_APP,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER
};


const connectDB = async () => {
  try {
    MongoSingleton.getInstance(configObject.mongo_url)
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    throw error;
  }
};


export { connectDB, configObject };
