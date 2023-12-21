import { Router } from "express";
import { ProductService } from "../../daos/mongo/productsDaoMongo.js";

const productsRouter = Router();

const productsService = new ProductService();

// endpoint para obtener todos los productos o un número limitado

productsRouter.get("/", async (req, res) => {
  try {
    let { limit } = req.query;
    const products = await productsService.getProducts(limit);
    res.send({products});

  } catch (error) {
    console.error("Error al obtener los productos en la ruta GET /products", error);
    res.status(500).send({status: "error", message: "Error del servidor al obtener los productos"});
  }
});

// endpoint para obtener productos por id

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid }  = req.params;
    const product = await productsService.getProductById(pid);

    if(product) {
      res.send({product});
    } else {
      res.status(404).send({status: "error", message: "Error! Producto con id no encontrado!"})
    }
    
  } catch (error) {
    console.error("Error en la ruta GET /products/:pid", error);
    res.status(500).send({ status: "error", message: "Error interno del servidor" });
  }
});

// endpoint para agregar un producto

productsRouter.post("/", async (req, res) => {
  try {
    let {title, description, code, price, stock, category, thumbnails, status} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
        return false;
    }

    status = !status && true;
    thumbnails = thumbnails || [];

    const productAdded = await productsService.addProduct({title, description, code, price, stock, category, thumbnails, status});

    if (productAdded) {
      res.status(200).send({ status:"ok", message: "Producto agregado correctamente"})
    } else {
      res.status(500).send({ status: "error", message: "Error del servidor. No se pudo agregar el producto"});
    }

  } catch (error) {
    console.error("Error en la ruta POST /products", error);
    res.status(500).send({
      status: "error",
      message: "Error del servidor! No se pudo agregar el producto",
    });
  }
});

// endpoint para actualizar un producto por id

productsRouter.put("/:pid", async (req, res) => {
  
  try {
    const { pid } = req.params;

    let {title, description, code, price, stock, category, thumbnails, status} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
      return false;
  }
  
    status = !status && true;
    thumbnails = thumbnails || [];

    const productUpdated = await productsService.updateProduct(pid, {title, description, code, price, stock, status, category, thumbnails});  
    if(productUpdated) {
      res.status(200).send({status: "success",message: "El producto se actualizó correctamente"});
    } else {
      res.status(500).send({status: "error", message: "Error! No se pudo actualizar el producto"})
    }
    
  } catch (error) {
    console.error("Error en la ruta PUT /products/:pid", error);
    res.status(500).send({
      status: "error",
      message: "Error del servidor. No se pudo actualizar el producto",
    });
  }
});

// endpoint para eliminar un producto

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const productDeleted = await productsService.deleteProduct(pid);

    if (productDeleted) {
      console.log("Producto eliminado correctamente");
      res.status(200).send({status: "success",message: "El Producto se eliminó correctamente!"});
    } else {
      res.status(500).send({status: "error",message: "Error. No se pudo eliminar el producto."});
    }
  } catch (error) {
    console.error("Error en la ruta DELETE /products/:pid", error);
    res.status(500).send({
      status: "error",
      message: "Error del servidor. No se pudo borrar el producto.",
    });
  }
});

export default productsRouter;
