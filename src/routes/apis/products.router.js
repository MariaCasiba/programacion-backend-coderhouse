import { Router } from "express";
import { ProductManager } from "../../managers/ProductManager.js";

const productsRouter = Router();

const productsService = new ProductManager();

// endpoint para obtener todos los productos o un número limitado

productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productsService.getProducts();
    const limitedProducts = limit
      ? products.slice(0, parseInt(limit))
      : products;
    res.send({ status: "success", payload: limitedProducts });
  } catch (error) {
    console.error(
      "Error al obtener los productos en la ruta GET /products",
      error
    );
    res
      .status(500)
      .send({
        status: "error",
        message: "Error del servidor al obtener los productos",
      });
  }
});

// endpoint para obtener productos por id

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsService.getProductById(parseInt(pid));
    res.send(product);
  } catch (error) {
    console.error("Error en la ruta GET /products/:pid", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
});

// endpoint para agregar un producto

productsRouter.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      res
        .status(400)
        .send({
          status: "error",
          message: "Debe completar los campos faltantes",
        });
      return;
    }

    status = !status && true;
    thumbnails = thumbnails || [];

    const productAdded = await productsService.addProduct({
      title,
      description,
      code,
      price,
      stock,
      status,
      category,
      thumbnails,
    });

    if (productAdded) {
      res
        .status(200)
        .send({ status: "ok", message: "Producto agregado correctamente" });
    } else {
      res
        .status(500)
        .send({
          status: "error",
          message: "Error del servidor. No se pudo agregar el producto",
        });
    }
  } catch (error) {
    console.error("Error en la ruta POST /products", error);
    res
      .status(500)
      .send({
        status: "error",
        message: "Error del servidor! No se pudo agregar el producto",
      });
  }
});

// endpoint para actualizar un producto por id

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      res
        .status(400)
        .send({
          status: "error",
          message: "Debe completar los campos faltantes",
        });
      return;
    }

    status = !status && true;
    thumbnails = thumbnails || [];

    await productsService.updateProduct(parseInt(pid), {
      title,
      description,
      code,
      price,
      stock,
      status,
      category,
      thumbnails,
    });
    res
      .status(200)
      .send({
        status: "success",
        message: "El producto se actualizó correctamente",
      });
  } catch (error) {
    console.error("Error en la ruta PUT /products/:pid", error);
    res
      .status(500)
      .send({
        status: "error",
        message: "Error del servidor. No se pudo actualizar el producto",
      });
  }
});

// endpoint para eliminar un producto

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    console.log("Intentando eliminar el producto con id: ", pid);

    if (await productsService.deleteProduct(parseInt(pid))) {
      console.log("Producto eliminado correctamente");
      res
        .status(200)
        .send({
          status: "success",
          message: "El Producto se eliminó correctamente!",
        });
    } else {
      res
        .status(500)
        .send({
          status: "error",
          message: "Error. No se pudo eliminar el producto.",
        });
    }
  } catch (error) {
    console.error("Error en la ruta DELETE /products/:pid", error);
    res
      .status(500)
      .send({
        status: "error",
        message: "Error del servidor. No se pudo borrar el producto.",
      });
  }
});

export default productsRouter;
