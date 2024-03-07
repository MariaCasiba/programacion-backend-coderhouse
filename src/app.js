import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ProductService } from "./daos/mongo/productsDaoMongo.js";
import { ChatService } from "./daos/mongo/chatDaoMongo.js";
import __dirname from "./utils/index.js";
import indexRouter from "./routes/index.js";
import { configObject, connectDB } from "./config/index.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { handleError } from "./middlewares/error/handleError.js";
import CustomError from "./services/errors/CustomError.js";
import generateProductsErrorInfo from "./services/errors/generateProductsErrorInfo.js";
import EErrors from "./services/errors/enums.js";
import { logger, addLogger } from "./utils/logger.js";


const app = express();
const PORT = configObject.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//cookies
app.use(cookieParser());
app.use(cors());

// middleware de passport
initializePassport();
app.use(passport.initialize());

// motor de plantilla handlebars
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.use(addLogger);
app.use(indexRouter);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// conexión a mongo
connectDB();


// servidor http
const serverHttp = app.listen(PORT, (err) => {
  if (err) {
    logger.fatal(err);
  }
  logger.info(`Servidor Express listo en puerto ${PORT}`);
});

// server para websockets
const socketServer = new Server(serverHttp);

// escucha nueva conexión
socketServer.on("connection", async (socket) => {
  logger.info("Nuevo cliente conectado");

  socket.on("ClientMessage", (data) => {
    logger.info("Mensaje del cliente:", data);
  });

  const productService = new ProductService();

  // escucha al agregar producto en RealTimeProducts con MongoDB
  socket.on("addProduct", async ({ product }) => {
    try {
      const newProduct = {
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
        status: product.status,
      };

      // Validación de campos requeridos
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
      const error = CustomError.createError({
        name: 'Product creation error',
        cause: generateProductsErrorInfo(newProduct),
        message: 'Error trying to create new product',
        code: EErrors.INVALID_TYPES_ERROR
      });
      throw error;
    }

      const productAdded = await productService.addProduct(newProduct);

      if (productAdded) {
        socketServer.emit("productAdded", productAdded);
      }
    } catch (error) {
      logger.error("Error al agregar el producto", error);
      socket.emit("productError", {error: "Error al agregar el producto"})
    }
  });

  // escucha al eliminar producto en RealTimeProducts con MongoDB
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

  const chatService = new ChatService(socket);

  const messages = await chatService.getMessages();
  socket.emit("messages", messages);

  // socket chatManager

  socket.on("newMessage", async (data) => {
    chatService.createMessage(data);

    const updatedMessages = await chatService.getMessages();
    socketServer.emit("messages", updatedMessages);
  });

});

app.use(handleError)

