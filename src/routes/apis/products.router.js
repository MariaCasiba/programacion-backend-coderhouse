import { Router } from "express";
//import ProductController from "../../controllers/products.controller.js";
import ProductController from "../../controllers/products.controller.js"

const productsRouter = Router();

const productController = new ProductController() 

// endpoint para obtener los productos
productsRouter.get("/", productController.getProducts);

// endpoint para obtener productos por id
productsRouter.get("/:pid", productController.getProductById);

// endpoint para agregar un producto
productsRouter.post("/", productController.addProduct);

// endpoint para actualizar un producto por id
productsRouter.put("/:pid", productController.updateProduct);

// endpoint para eliminar un producto
productsRouter.delete("/:pid", productController.deleteProduct);

export default productsRouter;
