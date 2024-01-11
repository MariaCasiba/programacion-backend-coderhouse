import { Router } from "express";
import { CartService } from "../../daos/mongo/cartsDaoMongo.js";

const cartsRouter = Router();

const cartsService = new CartService();



// endpoint para crear o obtener un carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const cartId = await cartsService.createCart();


    if (cartId) {
      
      return res.status(200).json({ status: "success", payload: { _id: cartId._id }, message: "El carrito se creó correctamente" });
    } else {
      return res.status(500).json({status: "error", message: "Error! No se pudo crear el carrito"})
    }


  } catch (error) {
    console.error("Error en la ruta POST /carts", error);
    res.status(500).json({ status: "error", message: "Error del servidor al crear o obtener el carrito." });
  }
});


// endpoint para obtener carrito por id
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsService.getCartById(cid);

    if (cart) {
      res.send({ status: "success", payload: cart });
    } else {
      res.status(400).send({ status: "error", message: "Error! No se encuentra el Id de carrito solicitado."});
    }

  } catch (error) {
    console.error("Error en la ruta GET /carts/:cid", error);
    res.status(500).send({ status: "error", message: "Error del servido al obtener el carrito solicitado."});
  }
});

// endpoint para obtener todos los carritos
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartsService.getCarts();

    if (carts) {
      res.send({status: "success", payload: carts });
    } else {
      res.status(400).send({
        status: "error", message: "Error! No se encuentra el Id de carrito solicitado.",
      });
    }

  } catch (error) {
    console.error("Error en la ruta GET /carts/", error);
    res.status(500).send({status: "error",message: "Error del servido al obtener los carritos.",
    });
  }
});


// endpoint para agregar un producto a un carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {

    const { cid, pid } = req.params;

    if (await cartsService.addProductToCart(cid, pid)) {
      res.send({status: "ok", message: "El producto se agregó correctamente o se actualizó la cantidad"})
    } else {
      res.status(500).send({status: "error", message: "No se pudo agregar el producto al carrito!"})
    }
    
  } catch (error) {
    console.error("Error en la ruta POST /carts/:cid/products/:pid", error);
    res.status(500).send({ status: "error", message: "Error del servidor al agregar producto al carrito" });
  }
});


// endpoint para eliminar todos los productos del carrito
cartsRouter.delete("/:cid/products", async (req, res) => {
  try {
      const { cid } = req.params;

      const result = await cartsService.deleteAllProductsInCart(cid);

      if (result) {
          res.status(200).send({ status: "success", message: "Todos los productos del carrito eliminados correctamente." });
      } else {
          res.status(404).send({ status: "error", message: "Error! No se pudieron eliminar todos los productos del carrito." });
      }

  } catch (error) {
      console.error("Error en la ruta DELETE /carts/:cid/products", error);
      res.status(500).send({ status: "error", message: "Error del servidor al eliminar todos los productos del carrito." });
  }
});

// endpoint para eliminar un producto del carrito
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
      const { cid, pid } = req.params;

      const result = await cartsService.deleteProductInCart(cid, pid);

      if (result) {
          res.status(200).send({ status: "success", message: "Producto eliminado del carrito correctamente." });
      } else {
          res.status(404).send({ status: "error", message: "Error! No se pudo eliminar el producto del carrito." });
      }

  } catch (error) {
      console.error("Error en la ruta DELETE /carts/:cid/products/:pid", error);
      res.status(500).send({ status: "error", message: "Error del servidor al eliminar el producto del carrito." });
  }
});


// endpoint para actualizar los productos del carrito 
cartsRouter.put("/:cid", async (req, res) => {
  try {
      const { cid } = req.params;
      const updatedProducts = req.body;

      if (!Array.isArray(updatedProducts)) {
        return res.status(400).send({status: "error", message: "El formato es incorrecto."});
      }

      const result = await cartsService.updateAllProductsInCart(cid, updatedProducts);

      if (result) {
          res.status(200).send({ status: "success", message: "Carrito actualizado correctamente." });
      } else {
          res.status(404).send({ status: "error", message: "Error! No se pudo actualizar el carrito." });
      }

  } catch (error) {
      console.error("Error en la ruta PUT /carts/:cid", error);
      res.status(500).send({ status: "error", message: "Error del servidor al actualizar el carrito." });
  }
});



// endpoint para actualizar la cantidad de un producto en el carrito
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body.quantity;

    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      return res.status(400).send({ status: "error", message: "La nueva cantidad debe ser un número mayor o igual a 0." });
    }

    const result = await cartsService.updateProductQuantity(cid, pid, newQuantity);

    if (result) {
      res.status(200).send({ status: "success", message: "Cantidad de producto en el carrito actualizada correctamente." });
    } else {
      res.status(404).send({ status: "error", message: "Error! No se pudo actualizar la cantidad del producto en el carrito." });
    }

  } catch (error) {
    console.error("Error en la ruta PUT /carts/:cid/products/:pid", error);
    res.status(500).send({ status: "error", message: "Error del servidor al actualizar la cantidad del producto en el carrito." });
  }
});


/*
// endpoint para eliminar un carrito
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
*/

export default cartsRouter;
