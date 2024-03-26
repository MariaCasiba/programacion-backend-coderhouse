import { Server } from "socket.io";
import { authenticationToken } from "./jwt.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";
import { ChatService } from "../daos/mongo/chatDaoMongo.js";
import { logger } from "./logger.js";
import CustomError from "../services/errors/CustomError.js";
import generateProductsErrorInfo from "../services/errors/generateProductsErrorInfo.js";
import EErrors from "../services/errors/enums.js";

export default function configureSockets(httpServer) {
    const socketServer = new Server(httpServer);

    socketServer.use((socket, next) => {
        const token = socket.handshake.auth.token;

        authenticationToken(
        { headers: { authorization: `Bearer ${token}` } },
        null,
        (err, userDecode) => {
            if (err) {
            return next(new Error("Unauthorized"));
            }
            logger.info("Usuario autenticado:", userDecode)
            socket.user = userDecode;
            next();
        }
        );
    });


    // escucha nueva conexión 
    socketServer.on("connection", async (socket) => {
        logger.info("Nuevo cliente conectado");

        const user = socket.user;

        if (user) {
        logger.info("Usuario autenticado:", user);
        } else {
        logger.info("No se encontró usuario autenticado del socket");
        }

        socket.on("ClientMessage", (data) => {
        logger.info("Mensaje del cliente:", data);
        });

        const productService = new ProductService();

        // agregar producto en realTimeProducts
        socket.on("addProduct", async ({ product, user }) => {
        try {
            const user = socket.user;

            if (user) {
            logger.info("Usuario autenticado:", user);
            } else {
            logger.info("No se encontró usuario autenticado del socket");
            }

            const userEmail =
            user && user.role === "premium" ? user.email : "admin";

            const newProduct = {
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
            status: product.status,
            owner: userEmail,
            };

            // validacion de campos requeridos
            if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.code ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.category
            ) {
                const error = CustomError.createError({
                    name: "Product creation error",
                    cause: generateProductsErrorInfo(newProduct),
                    message: "Error trying to create new product",
                    code: EErrors.INVALID_TYPES_ERROR,
                });
                throw error;
            }

            const productAdded = await productService.addProduct(newProduct);

            if (productAdded) {
            socketServer.emit("productAdded", { product: productAdded, user });
            }
        } catch (error) {
            logger.error("Error al agregar el producto", error);
            socket.emit("productError", { error: "Error al agregar el producto" });
        }
        });

        // escucha al eliminar producto en realTimeProducts
        socket.on("deleteProduct", async (productId) => {
        try {
            const productDeleted = await productService.deleteProduct(productId);

            if (productDeleted) {
            logger.info("producto eliminado: ", productId);
            socketServer.emit("productDeleted", productId);
            }
        } catch (error) {
            logger.error("Error al eliminar el producto", error);
        }
        });

        // socket chatManager
        const chatService = new ChatService(socket);

        const messages = await chatService.getMessages();
        socket.emit("messages", messages);

        socket.on("newMessage", async (data) => {
        chatService.createMessage(data);

        const updatedMessages = await chatService.getMessages();
        socketServer.emit("messages", updatedMessages);
        });
    });
    }
