import { Router } from "express";
import CartController from "../../controllers/carts.controller.js";
import { passportCall } from "../../utils/passportCall.js"
import { authorizationJwt } from "../../passport-jwt/jwtPassport.middleware.js";


const cartsRouter = Router();

const cartController = new CartController()


// endpoint para crear o obtener un carrito
cartsRouter.post("/", cartController.createCart);

// endpoint para obtener todos los carritos
cartsRouter.get("/", cartController.getCarts);

// endpoint para agregar un producto a un carrito
cartsRouter.post("/:cid/products/:pid", cartController.addProductToCart);

// endpoint para eliminar todos los productos del carrito
cartsRouter.delete("/:cid/products", cartController.deleteAllProductsInCart);

// endpoint para eliminar un producto del carrito
cartsRouter.delete("/:cid/products/:pid", cartController.deleteProductInCart);

// endpoint para actualizar los productos del carrito 
cartsRouter.put("/:cid", cartController.updateAllProductsInCart);

// endpoint para actualizar la cantidad de un producto en el carrito
cartsRouter.put("/:cid/products/:pid", cartController.updateProductQuantity);

// endpoint para eliminar un carrito
cartsRouter.delete("/:cid", cartController.deleteCart);


// endpoint para obtener carrito por id
cartsRouter.get("/:cid", cartController.getCartById);

// endpoint para finalizar compra y crear ticket
cartsRouter.post("/:cid/purchase", passportCall('jwt'), authorizationJwt(["USER"]), cartController.createPurchaseTicket);


export default cartsRouter;
