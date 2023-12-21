import { messageModel } from "./models/message.model.js";

export class ChatService {
    async getMessages() {
        try {
            return await messageModel.find();
        } 
        catch (error) {
            console.error("Error al obtener mensajes", error);
            throw error;
        }
    }

    async createMessage(message) {
        try {
            return await messageModel.create(message);
        } catch (error) {
            console.error("Error al crear mensaje", error);
            throw error;
        }
    }
}