
import { cartModel } from "./models/cart.model.js";


export class CartService {
    constructor() {
        this.model = cartModel;
    }

    // crear carrito
    createCart = async () => {
            const newCart = await cartModel.create({ products: [] });
            console.log("Carrito creado con id: ", newCart._id);
            return newCart._id;
    }

    // obtener carrito por id
    getCartById = async (cid) => {
            const cart = await cartModel.findOne({_id: cid}).populate('products.product');
            return cart; 
        }
    

    // obtener todos los carritos
    getCarts = async () => {
            const carts = await cartModel.find();
            return carts;
    }

    // borrar un carrito por su id
    deleteCartById = async (cartId) => {
            const deletedCart = await cartModel.findByIdAndDelete(cartId);
            if (deletedCart) {
                console.log("Carrito eliminado correctamente!");
                return true;
            } else {
                console.log("No se encontró el carrito a eliminar!");
                return false;
            }
    };

    // actualizar los productos del carrito
    updateCartProducts = async (cartId, updatedProducts) => {
            const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: updatedProducts }, { new: true });
            if (updatedCart) {
                console.log("Carrito actualizado correctamente:", updatedCart);
                return true;
            } else {
                console.log("No se encontró el carrito a actualizar");
                return false;
            }
    }

    // actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (cartId, productId, newQuantity) => {
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
    }

    // borrar todos los productos del carrito
    deleteAllProductsInCart = async (cartId) =>  {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("No se encontró el carrito!");
                return false;
            }
            cart.products = []; 

            await cart.save(); 
            console.log("Se eliminaron todos los productos del carrito correctamente.");
            return true;

    }
}

