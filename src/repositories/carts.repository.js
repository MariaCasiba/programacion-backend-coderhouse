import { CartService } from "../daos/mongo/cartsDaoMongo.js"
import { logger } from "../utils/logger.js";

class CartRepository {
    constructor() {
        this.cartService = new CartService();
    }
    
    // Crear un nuevo carrito
    createCart = async () => {
        try {
            return await this.cartService.createCart();
        } catch (error) {
            logger.error("Error al crear el carrito", error);
            throw error;
        }
    }

    // Obtener un carrito por su id
    getCartById = async (cid) => {
        try {
            return await this.cartService.getCartById(cid);
        } catch (error) {
            logger.error("Error al obtener el carrito por su id", error);
            throw error;
        }
    }

    // Obtener todos los carritos
    getCarts = async () => {
        try {
            return await this.cartService.getCarts();
        } catch (error) {
            logger.error("Error al obtener los carritos", error);
            throw error;
        }
    }

    // Eliminar un carrito por su id
    deleteCartById = async (cartId) => {
        try {
            return await this.cartService.deleteCartById(cartId);
        } catch (error) {
            logger.error("Error al eliminar el carrito:", error);
            throw error;
        }
    }

    // Actualizar los productos del carrito
    updateCartProducts = async (cartId, updatedProducts) => {
        try {
            return await this.cartService.updateCartProducts(cartId, updatedProducts);
        } catch (error) {
            logger.error("Error al actualizar los productos del carrito:", error);
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (cartId, productId, newQuantity) => {
        try {
            return await this.cartService.updateProductQuantity(cartId, productId, newQuantity);
        } catch (error) {
            logger.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    // Eliminar todos los productos del carrito
    deleteAllProductsInCart = async (cartId) => {
        try {
            return await this.cartService.deleteAllProductsInCart(cartId);
        } catch (error) {
            logger.error("Error al eliminar todos los productos del carrito:", error);
            throw error;
        }
    }

    // Eliminar un producto del carrito
    deleteProductInCart = async (cartId, productId) => {
        try {
            return await this.cartService.deleteProductInCart(cartId, productId);
        } catch (error) {
            logger.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }
}

export default CartRepository;
