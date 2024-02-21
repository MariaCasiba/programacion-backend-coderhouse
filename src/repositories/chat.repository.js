import { ChatService } from "../daos/mongo/chatDaoMongo.js"

class ChatRepository {
    constructor(socket) {
        this.chatService = new ChatService(socket);
    }

    // obtener mensajes
    getMessages = async () => {
        try {
            return await this.chatService.getMessages();
        } catch (error) {
            console.error("Error al obtener mensajes", error);
            throw error;
        }
    }

    // crear mensaje
    createMessage = async (message) => {
        try {
            return await this.chatService.createMessage(message);
        } catch (error) {
            console.error("Error al crear mensaje", error);
            throw error;
        }
    }
}

export default ChatRepository;
