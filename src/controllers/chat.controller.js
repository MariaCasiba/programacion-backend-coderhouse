import { ChatService } from "../daos/mongo/chatDaoMongo.js";

class ChatController {
    constructor(socket) {
        this.chatService = new ChatService(socket);
    }

    // obtener mensajes
    getMessages = async (req, res) => {
        try {
            const messages = await this.chatService.getMessages();
            res.status(200).json({ status: "success", payload: messages });
        } catch (error) {
            console.error("Error en la ruta GET /messages", error);
            res.status(500).json({ status: "error", message: "Error del servidor al obtener los mensajes." });
        }
    };

    // crear mensajes
    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            if (!user || !message) {
                return res.status(400).json({ status: "error", message: "El usuario y el mensaje son campos obligatorios." });
            }
            const newMessage = await this.chatService.createMessage({ user, message });
            res.status(201).json({ status: "success", payload: newMessage });
        } catch (error) {
            console.error("Error en la ruta POST /messages", error);
            res.status(500).json({ status: "error", message: "Error del servidor al crear el mensaje." });
        }
    };
}

export default ChatController;
