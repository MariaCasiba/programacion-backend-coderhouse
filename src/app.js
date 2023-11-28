import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";


const app = express();
const port = 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// router para manejo de productos
app.use("/api/products", productsRouter)

// router para manejo de carritos
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
    console.log(`Servidor Express listo en puerto ${port}`);
    });


