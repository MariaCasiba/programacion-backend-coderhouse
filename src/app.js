import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
//import { ProductManager } from "./daos/file/ProductManagerFs.js";
import { ProductService } from "./daos/mongo/productsDaoMongo.js";
import { ChatService } from "./daos/mongo/chatDaoMongo.js";
import __dirname from "./utils/index.js";
//import __dirname from "./utils.js";
import indexRouter from "./routes/index.js";
import { connectDB } from "./config/index.js";
// passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";



const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//cookies
app.use(cookieParser('s3cr3t@'));


// estrategia guardar session en base de datos Mongo 

app.use(session({
  store:MongoStore.create({
    mongoUrl: "mongodb+srv://mariacasiba:GusGus59@mariacasiba.kduocgy.mongodb.net/test?retryWrites=true&w=majority",
    mongoOptions:{
      useNewUrlParser:true, 
      useUnifiedTopology:true
    },
    ttl:15000000000
  }),
  secret: 'secretCoder',
  resave: true,
  saveUninitialized: true
})); 


// passport github
app.use(session({
  secret:"secretCoder",
  resave: false, 
  saveUninitialized: false,
}))


// middleware de passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.use(indexRouter);

// motor de plantilla handlebars
app.engine('hbs', exphbs({
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));


app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// conexión a mongo
connectDB()


// middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("error de server");
});



// servidor http
const serverHttp = app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Servidor Express listo en puerto ${PORT}`);
});



// server para websockets
const socketServer = new Server(serverHttp);

// escucha nueva conexión
socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("ClientMessage", (data) => {
    console.log("Mensaje del cliente:", data);
  });


  const productService = new ProductService();

  // escucha al agregar producto en RealTimeProducts con MongoDB
  socket.on("addProduct", async ({ product }) => {

    try {

        const newProduct = {
          title:product.title,
          description: product.description,
          code: product.code,
          price:product.price,
          stock:product.stock,
          category: product.category,
          thumbnails: product.thumbnails,
          status: product.status,
        
        }

        const productAdded = await productService.addProduct(newProduct);

        if(productAdded) {
          socketServer.emit("productAdded", productAdded);

        }

      } catch (error) {
      console.error("Error al agregar el producto", error);
    }

  });

  // escucha al eliminar producto en RealTimeProducts con MongoDB
  socket.on("deleteProduct", async (productId) => {
    try {
      const productDeleted = await productService.deleteProduct(productId);

      if(productDeleted) {
        console.log("producto eliminado: ", productId);
        socketServer.emit("productDeleted", productId);
      }
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  })


  const chatService = new ChatService(socket);

  const  messages = await chatService.getMessages();
  socket.emit("messages", messages);

  // socket chatManager 
  
  socket.on("newMessage", async (data) => {
    chatService.createMessage(data);
    
      const updatedMessages = await chatService.getMessages();
      socketServer.emit("messages", updatedMessages);
    })


  /*
  // Escucha al agregar producto en RealTimeProducts con fs
  socket.on("addProduct", async ({ product }) => {
    const productManager = new ProductManager();

    const newProduct = {
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
    };

    const nextProductId = await productManager.getId();
    newProduct.id = nextProductId;

    const productAdded = await productManager.addProduct(newProduct);

    if (productAdded) {
      socketServer.emit("productAdded", newProduct);
    }
  });

  // escucha al eliminar producto en RealTimeProducts con fs 
  socket.on("deleteProduct", async (productId) => {
    console.log("producto a eliminar en el servidor:", productId);
    const productManager = new ProductManager();
    const productDeleted = await productManager.deleteProduct(
      parseInt(productId)
    );

    if (productDeleted) {
      console.log("producto eliminado:", productId);
      socketServer.emit("productDeleted", productId);
    }
  });*/
}); 
