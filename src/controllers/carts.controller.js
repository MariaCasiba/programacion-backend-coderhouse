import { CartService } from "../daos/mongo/cartsDaoMongo.js";

class CartController {
    constructor() {
        this.cartsService = new CartService();
    }
    
    // crear carrito
    createCart = async (req, res) => {
        try {
            const cartId = await this.cartsService.createCart();
        
        
            if (cartId) {
            
                return res.status(200).json({ status: "success", payload: { _id: cartId._id }, message: "El carrito se creó correctamente" });
            } else {
              return res.status(500).json({status: "error", message: "Error! No se pudo crear el carrito"})
            }
        
        
          } catch (error) {
            console.error("Error en la ruta POST /carts", error);
            res.status(500).json({ status: "error", message: "Error del servidor al crear o obtener el carrito." });
          }
    }


    //obtener carrito por id
    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.getCartById(cid);
        
            if (cart) {
              res.send({ status: "success", payload: cart });
            } else {
              res.status(400).send({ status: "error", message: "Error! No se encuentra el Id de carrito solicitado."});
            }
        
          } catch (error) {
            console.error("Error en la ruta GET /carts/:cid", error);
            res.status(500).send({ status: "error", message: "Error del servido al obtener el carrito solicitado."});
          }
    }
    // obtener todos los carritos
    getCarts = async (req, res) => {
        try {
            const carts = await this.cartsService.getCarts();
        
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
    }


    // agregar producto al carrito
    addProductToCart = async (req, res) => {
        try {
    

            const { cid, pid } = req.params;  
        
            if (await this.cartsService.addProductToCart(cid, pid)) {
              return res.send({ status: "ok", message: "El producto se agregó correctamente o se actualizó la cantidad" });
            } else {
              return res.status(500).send({ status: "error", message: "No se pudo agregar el producto al carrito!" });
            }
            
          } catch (error) {
            console.error("Error en la ruta POST /carts/:cid/products/:pid", error);
            return res.status(500).send({ status: "error", message: "Error del servidor al agregar producto al carrito" });
          }
    }


    // eliminar todos los productos del carrito
    deleteAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params;
      
            const result = await this.cartsService.deleteAllProductsInCart(cid);
      
            if (result) {
                res.status(200).send({ status: "success", message: "Todos los productos del carrito eliminados correctamente." });
            } else {
                res.status(404).send({ status: "error", message: "Error! No se pudieron eliminar todos los productos del carrito." });
            }
      
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid/products", error);
            res.status(500).send({ status: "error", message: "Error del servidor al eliminar todos los productos del carrito." });
        }
    }


    // eliminar un producto del carrito
    deleteProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
      
            const result = await this.cartsService.deleteProductInCart(cid, pid);
      
            if (result) {
                res.status(200).send({ status: "success", message: "Producto eliminado del carrito correctamente." });
            } else {
                res.status(404).send({ status: "error", message: "Error! No se pudo eliminar el producto del carrito." });
            }
      
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al eliminar el producto del carrito." });
        }
    }


    // actualizar productos del carrito
    updateAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const updatedProducts = req.body;
      
            if (!Array.isArray(updatedProducts)) {
              return res.status(400).send({status: "error", message: "El formato es incorrecto."});
            }
      
            const result = await this.cartsService.updateAllProductsInCart(cid, updatedProducts);
      
            if (result) {
                res.status(200).send({ status: "success", message: "Carrito actualizado correctamente." });
            } else {
                res.status(404).send({ status: "error", message: "Error! No se pudo actualizar el carrito." });
            }
      
        } catch (error) {
            console.error("Error en la ruta PUT /carts/:cid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al actualizar el carrito." });
        }
    }


    // actualizar la cantidad del producto en carrito
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const newQuantity = req.body.quantity;
        
            if (typeof newQuantity !== 'number' || newQuantity < 0) {
              return res.status(400).send({ status: "error", message: "La nueva cantidad debe ser un número mayor o igual a 0." });
            }
        
            const result = await this.cartsService.updateProductQuantity(cid, pid, newQuantity);
        
            if (result) {
              res.status(200).send({ status: "success", message: "Cantidad de producto en el carrito actualizada correctamente." });
            } else {
              res.status(404).send({ status: "error", message: "Error! No se pudo actualizar la cantidad del producto en el carrito." });
            }
        
          } catch (error) {
            console.error("Error en la ruta PUT /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al actualizar la cantidad del producto en el carrito." });
          }
    }


    // eliminar carrito
    deleteCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const deletedCart = await this.cartsService.deleteCartById(cid);
        
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
    }

}

export default CartController