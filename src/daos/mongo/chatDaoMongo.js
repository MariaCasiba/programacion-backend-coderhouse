import { messageModel } from "./models/message.model.js";

export class ChatService {

    constructor(socket) {
        this.socket = socket;
    }

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
            const newMessage = await messageModel.create(message);
            this.socket.emit("newMessage", newMessage); // Emite el nuevo mensaje a todos los clientes
            return newMessage;
        } catch (error) {
            console.error("Error al crear mensaje", error);
            throw error;
        }
    }
}