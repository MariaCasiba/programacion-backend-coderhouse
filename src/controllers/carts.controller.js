
import { CartService } from "../daos/mongo/cartsDaoMongo.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";

class CartController {
    constructor() {
        this.cartsService = new CartService();
        this.productService = new ProductService();
    }
    
    //  crear un nuevo carrito
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


    // Obtener un carrito por su id
    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.getCartById(cid);
        
            if (cart) {
                res.send({ status: "success", payload: cart });
            } else {
                res.status(400).send({
                    status: "error",
                    message: "Error! No se encuentra el carrito solicitado."
                });
            }
        } catch (error) {
            console.error("Error en la ruta GET /carts/:cid", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor al obtener el carrito solicitado."
            });
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
                    status: "error",
                    message: "Error! No se encontraron carritos."
                });
            }
        } catch (error) {
            console.error("Error en la ruta GET /carts/", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor al obtener los carritos."
            });
        }
    }

    
    // eliminar un carrito por su id
    deleteCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const deletedCart = await this.cartsService.deleteCartById(cid);
        
            if (deletedCart) {
                res.status(200).send({
                    status: "success",
                    message: "Carrito eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    status: "error",
                    message: "No se encontró el carrito a eliminar"
                });
            }
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor al eliminar el carrito"
            });
        }
    }

    // agregar producto al carrito
    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
    
            if (!cid || !pid) {
                return res.status(400).send({ status: "error", message: "El ID del carrito o del producto no fueron proporcionados." });
            }
    
            const cart = await this.cartsService.getCartById(cid);
            const product = await this.productService.getProductById(pid); 
    
            if (!cart || !product) {
                return res.status(404).send({ status: "error", message: "No se encontró el carrito o el producto." });
            }
    
            const existingProduct = cart.products.find(item => item.product.equals(product._id));
    
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: product._id, quantity: 1 });
            }
    
            const result = await this.cartsService.updateCartProducts(cid, cart.products);
    
            if (result) {
                return res.status(200).send({ status: "success", message: "El producto se agregó correctamente o se actualizó la cantidad." });
            } else {
                return res.status(500).send({ status: "error", message: "No se pudo agregar el producto al carrito." });
            }
        } catch (error) {
            console.error("Error en la ruta POST /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al agregar el producto al carrito." });
        }
    }

    // borrar todos los productos del carrito 
    deleteAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params;

            const result = await this.cartsService.deleteAllProductsInCart(cid);

            if (result) {
                res.status(200).send({ status: "success", message: "Todos los productos del carrito fueron eliminados correctamente." });
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
            const cart = await this.cartsService.getCartById(cid);
    
            if (!cart) {
                return res.status(404).send({ status: "error", message: "No se encontró el carrito." });
            }  
            
            const updatedProducts = cart.products.filter(item => !item.product.equals(pid));
            
            const result = await this.cartsService.updateCartProducts(cid, updatedProducts);
    
            if (result) {
                return res.status(200).send({ status: "success", message: "Producto eliminado del carrito correctamente." });
            } else {
                return res.status(404).send({ status: "error", message: "Error al eliminar el producto del carrito." });
            }
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al eliminar el producto del carrito." });
        }
    }

    // actualizar los productos del carrito
    updateAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const updatedProducts = req.body;
            
            const cart = await this.cartsService.getCartById(cid);
            if (!cart) {
                return res.status(404).send({ status: "error", message: "No se encontró el carrito." });
            }

            cart.products = [];
            
            for (const updatedProduct of updatedProducts) {
                const product = await this.productService.getProductById(updatedProduct.productId);
                if (!product) {
                    return res.status(404).send({ status: "error", message: `El producto con ID ${updatedProduct.productId} no existe.` });
                }
                cart.products.push({ product: product._id, quantity: updatedProduct.quantity });
            }
            
            const result = await this.cartsService.updateCartProducts(cid, cart.products);
            if (result) {
                return res.status(200).send({ status: "success", message: "Carrito actualizado correctamente." });
            } else {
                return res.status(404).send({ status: "error", message: "Error! No se pudo actualizar el carrito." });
            }
        } catch (error) {
            console.error("Error en la ruta PUT /carts/:cid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al actualizar el carrito." });
        }
    }

    // actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
    
            // Validar que la cantidad sea un número mayor o igual a cero
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).send({ status: "error", message: "La nueva cantidad debe ser un número mayor o igual a 0." });
            }
    
            const result = await this.cartsService.updateProductQuantity(cid, pid, quantity);
    
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
    
}


export default CartController;

