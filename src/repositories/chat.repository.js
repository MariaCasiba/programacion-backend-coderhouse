import { ChatService } from "../daos/mongo/chatDaoMongo.js"
import { logger } from "../utils/logger.js";

class ChatRepository {
    constructor(socket) {
        this.chatService = new ChatService(socket);
    }

    // obtener mensajes
    getMessages = async () => {
        try {
            return await this.chatService.getMessages();
        } catch (error) {
            logger.warning("Error al obtener mensajes", error);
            throw error;
        }
    }

    // crear mensaje
    createMessage = async (message) => {
        try {
            return await this.chatService.createMessage(message);
        } catch (error) {
            logger.warning("Error al crear mensaje", error);
            throw error;
        }
    }
}

export default ChatRepository;
