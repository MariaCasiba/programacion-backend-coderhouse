import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const port = 8080;

const productManager = new ProductManager();

// endpoint para obtener todos los productos o un número limitado

app.get("/products", async (req, res) => {

    const {limit} = req.query;

    try{
        const products = await productManager.getProducts();
        
        if (limit) {
            const busquedalimitada = products.slice(0, limit)
            return res.send(busquedalimitada)
        } 
            return res.send(products)
        
    } catch (error) {
        return res.status(500).send({status: "error", message:"Error! No se encontró el producto"})
    }
}) 


// endpoint para obtener productos por id 

app.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productManager.getProductById(parseInt(pid));
        return res.send(product);
    } catch (error) {
        return res.status(500).send({status: "error", message:`Error! No se encontró el producto con el id ${pid}` })
    }
})

app.listen(port, () => {
    console.log(`Servidor Express listo en puerto ${port}`);
    });


// Testing del desafío entregable:

// Llamo en el navegador: http://localhost:8080/products . Devuelve los diez productos de Products.Json que ya fueron creados con el método addProducts de ProductManager en Products.json.
// Llamo en el navegador: http://localhost:8080/products?limit=5. Devuelve los 5 primeros productos de Products.json.
// Llamo en el navegdor: http://localhost:8080/products/2 . Devuelve el producto con el id 2.
// Llamo en el navegdor: http://localhost:8080/products/20 . Devuelve mensaje de error.
