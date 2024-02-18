import { messageModel } from "./models/message.model.js";

export class ChatService {

    constructor(socket) {
        this.socket = socket;
    }

    // obtener mensajes
    getMessages = async () => {
        try {
            return await messageModel.find();
        } 
        catch (error) {
            console.error("Error al obtener mensajes", error);
            throw error;
        }
    }

    // crear mensajes
    createMessage = async (message) => {
        try {
            const newMessage = await messageModel.create(message);
            this.socket.emit("newMessage", newMessage); 
            return newMessage;
        } catch (error) {
            console.error("Error al crear mensaje", error);
            throw error;
        }
    }
}

