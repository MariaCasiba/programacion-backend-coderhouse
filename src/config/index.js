import mongoose from "mongoose";
import dotenv from "dotenv";
import { program } from "../utils/commander.js";

const { mode } = program.opts();
console.log('mode config: ', mode)


dotenv.config({
    path: mode === "development" ? "./.env.development" : "./env.production",
});

const configObject = {
  PORT: process.env.PORT || 8000,
  mongo_url: process.env.MONGO_URL,
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
};

const MONGO = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO, {});
    console.log("Base de datos MongoDB conectada");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    throw error;
  }
};

export { connectDB, configObject };
