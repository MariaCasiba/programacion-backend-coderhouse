import express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import productsRouter from "./routes/apis/products.router.js";
import cartsRouter from "./routes/apis/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { ProductManager } from "./managers/ProductManager.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// motor de plantilla handlebars
app.engine(
    "hbs",
    handlebars.engine({
    extname: ".hbs",
    })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");


// localhost:8080/api/products
// ruta para manejo de productos
app.use("/api/products", productsRouter);
// ruta para manejo de carritos
app.use("/api/carts", cartsRouter);
// ruta para vistas handlebars
app.use("/", viewsRouter);

// middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("error de server");
});

// servidor http
const serverHttp = app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Servidor Express listo en puerto ${port}`);
});

// server para websockets
const socketServer = new Server(serverHttp);

// escucha nueva conexión
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("ClientMessage", (data) => {
    console.log("Mensaje del cliente:" , data);
  });


// Escucha al agregar producto en RealTimeProducts
socket.on("addProduct", async ({ product }) => {
  const productManager = new ProductManager();

  const newProduct = {
    title: product.title,
    description: product.description,
    code: product.code,
    price: product.price,
    stock: product.stock,
    category: product.category
  };

  const nextProductId = await productManager.getId();
  newProduct.id = nextProductId;

  const productAdded = await productManager.addProduct(newProduct);

  if (productAdded) {
    socketServer.emit("productAdded", newProduct);
  }
});


// escucha al eliminar producto en RealTimeProducts
socket.on("deleteProduct", async (productId) => {
  console.log("producto a eliminar en el servidor:", productId);
  const productManager = new ProductManager();
  const productDeleted = await productManager.deleteProduct(parseInt(productId));

  if (productDeleted) {
    console.log("producto eliminado:", productId)
    socketServer.emit("productDeleted", productId);
  }
});

})
