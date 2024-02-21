
import { cartModel } from "./models/cart.model.js";


export class CartService {
    constructor() {
        this.model = cartModel;
    }

    // crear carrito
    createCart = async () => {
        try {
            const newCart = await cartModel.create({ products: [] });
            console.log("Carrito creado con id: ", newCart._id);
            return newCart._id;
        } catch (error) {
            console.error("Error al crear el carrito", error);
            return null;
        }
    }

    // obtener carrito por id
    getCartById = async (cid) => {
        try {
            const cart = await cartModel.findOne({_id: cid}).populate('products.product');
            return cart; 
        } catch (error) {
            console.error("Error al obtener el carrito por su id", error);
            return null;
        }
    }

    // obtener todos los carritos
    getCarts = async () => {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            return [];
        }
    }

    // borrar un carrito por su id
    deleteCartById = async (cartId) => {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(cartId);
            if (deletedCart) {
                console.log("Carrito eliminado correctamente!");
                return true;
            } else {
                console.log("No se encontró el carrito a eliminar!");
                return false;
            }
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            return false;
        }
    };

    // actualizar los productos del carrito
    updateCartProducts = async (cartId, updatedProducts) => {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: updatedProducts }, { new: true });
            if (updatedCart) {
                console.log("Carrito actualizado correctamente:", updatedCart);
                return true;
            } else {
                console.log("No se encontró el carrito a actualizar");
                return false;
            }
        } catch (error) {
            console.error("Error al actualizar los productos del carrito:", error);
            return false;
        }
    }

    // actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (cartId, productId, newQuantity) => {
        try {
            const cart = await this.getCartById(cartId);

            if (!cart) {
                console.log("No se encontró el carrito.");
                return false;
            }

            const result = await cartModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $set: { 'products.$.quantity': newQuantity } }
            );

            if (result) {
                console.log("Cantidad de producto actualizada correctamente.");
                return true;
            } else {
                console.log("No se encontró el producto en el carrito.");
                return false;
            }
        } catch (error) {
            console.log("Error! No se pudo actualizar la cantidad del producto:", error);
            return false;
        }
    }

    // borrar todos los productos del carrito
    deleteAllProductsInCart = async (cartId) =>  {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("No se encontró el carrito!");
                return false;
            }
            cart.products = []; 

            await cart.save(); 
            console.log("Se eliminaron todos los productos del carrito correctamente.");
            return true;

        } catch (error) {
            console.log("Error! No se pudieron eliminar todos los productos del carrito.", error);
            return false;
        }
    }
}

