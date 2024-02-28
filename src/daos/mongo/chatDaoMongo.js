import { messageModel } from "./models/message.model.js";

export class ChatService {

    constructor(socket) {
        this.socket = socket;
    }

    // obtener mensajes
    getMessages = async () => {
            return await messageModel.find();
    }

    // crear mensajes
    createMessage = async (message) => {
        
            const newMessage = await messageModel.create(message);
            this.socket.emit("newMessage", newMessage); 
            return newMessage;
    }
}
