import mongoose from "mongoose";

const MONGO = "mongodb+srv://mariacasiba:GusGus59@mariacasiba.kduocgy.mongodb.net/"

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO, {
        });
        console.log("Base de datos MongoDB conectada");
    } catch (error) {
        console.error("Error al conectar a MongoDB", error);
        throw error;
    }
    };

export { connectDB };
