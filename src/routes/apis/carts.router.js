import { Router } from "express";
import { CartService } from "../../daos/mongo/cartsDaoMongo.js";

const cartsRouter = Router();

const cartsService = new CartService();

// endpoint para crear un carrito

cartsRouter.post("/", async (req, res) => {
  try {

    const newCart = await cartsService.createCart();

    if(newCart) {
      res.status(200).send({ status: "success", message: "El carrito se creó correctamente"});
    } else {
      res.status(500).send({ status: "error", message: "Error! No se pudo crear el carrito"});
    }
    
  } catch (error) {
    console.error("Error en la ruta POST /carts", error);
    res.status(500).send({
      status: "error", message: "Error del servidor al crear el carrito.",
    });
  }
});

// endpoint para obtener carrito por id

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsService.getCartById(cid);

    if (cart) {
      res.send({ products: cart.products });
    } else {
      res.status(400).send({
        status: "error", message: "Error! No se encuentra el Id de carrito solicitado.",
      });
    }

  } catch (error) {
    console.error("Error en la ruta GET /carts/:cid", error);
    res.status(500).send({
      status: "error", message: "Error del servido al obtener el carrito solicitado.",
    });
  }
});

// endpoint para obtener todos los carritos

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartsService.getCarts();

    if (carts) {
      res.send({ carts: carts });
    } else {
      res.status(400).send({
        status: "error", message: "Error! No se encuentra el Id de carrito solicitado.",
      });
    }

  } catch (error) {
    console.error("Error en la ruta GET /carts/", error);
    res.status(500).send({
      status: "error",
      message: "Error del servido al obtener los carritos.",
    });
  }
});

// endpoint para agregar un producto a un carrito

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const productToCart = await cartsService.addProductToCart(cid, pid);

    if (productToCart) {
      return res.status(200).send({ status: "success", message: "Producto agregado al carrito" });
    } else {
      res.status(404).send({ status: "error", message: "Error! No se pudo agregar el producto al carrito"})
    }


  } catch (error) {
    console.error("Error en la ruta POST /carts/:cid/products/:pid", error);
    res.status(500).send({status: "error",message: "Error del servido al agregar producto al carrito",
    });
  }
});


cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartsService.deleteCartById(cid);

    if (deletedCart) {
      res.status(200).send({
        status: "success", message: "Carrito eliminado correctamente",
      });
    } else {
      res.status(404).send({
        status: "error", message: "No se encontró el carrito a eliminar",
      });
    }
  } catch (error) {
    console.error("Error en la ruta DELETE /carts/:cid", error);
    res.status(500).send({
      status: "error", message: "Error del servidor al eliminar el carrito",
    });
  }
});


export default cartsRouter;
