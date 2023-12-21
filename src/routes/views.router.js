import { Router } from "express";
import exphbs from "express-handlebars";
//import { ProductManager } from "../daos/file/ProductManagerFs.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";


const router = Router();

const productService = new ProductService(); 

// vista de handlebars para mostrar todos los productos
router.get("/", async (req, res) => {
  try {
    let products = await productService.getProducts();
    res.render("home", { products } );

  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
});



// vista de handlebars de productos en tiempo real 
router.get("/realtimeproducts", async (req, res) => {
  try {
    let realTimeProducts = await productService.getProducts();
    res.render("realTimeProducts", { realTimeProducts: realTimeProducts });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});



// vista de handlebars para el chat 
router.get("/chat", (req, res) => {
  res.render("chat");
})


/*
// vista de handlebars de productos con fs
router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    res.render("home", {
      title: "Productos",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
});

// vista de handlebars de productos en tiempo real con fs 
router.get("/realtimeproducts", async (req, res) => {
  try {
    let realTimeProducts = await productManager.getProducts();
    res.render("realTimeProducts", { realTimeProducts: realTimeProducts });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});


router.post("/products", (req, res) => {
    const newProduct = productManager.addProduct(req.body);
    req.app.get("socketServer").emit("product_created", newProduct);
    res.json(newProduct);
    });
    
router.delete("/products/:id", (req, res) => {
    let id = Number(req.params.id);
    const deletedProduct = productManager.deleteProduct(id);
    res.send({
    status: "ok",
    message: "El Producto se eliminó correctamente!",
    });
    req.app.get("socketServer").emit("product_deleted", deletedProduct);
    res.json(deletedProduct);
    
    });
*/

export default router;
