import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

export class CartService {

    constructor(){
        this.model = cartModel;
    }

    // crear carrito
    async createCart() {
        try {
        const newCart = await cartModel.create({ products: [] });
        console.log("Carrito creado");
        return newCart;

        } catch (error) {
        console.error("Error al crear el carrito", error);
        return null;
        }
    }

    // obtener carrito por id
    async getCartById(cartId) {
        try {
        const cart = await cartModel.findById(cartId);
        

        if(!cart) {
            console.log(`Carrito con id ${cartId} no encontrado`);
            return null;
        }

        return cart 

        } catch (error) {
        console.error("Error al obtener el carrito por su id", error);
        return null;
        }
    }

    // obtener todos los carritos
    async getCarts() {
        try {
        const carts = await cartModel.find();
        return carts;
        } catch (error) {
        console.error("Error al obtener los carritos", error);
        return [];
        }
    }


    async addProductToCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            const product = await productModel.findById(pid);

            if (!cart) {
                console.log("No se encontró el carrito!");
                return false;
            }
            if (!product) {
                console.log("No se encontró el producto.")
                return false;
            }

            const existingProduct = cart.products.find(item => item.product.toString() === pid);

            if (existingProduct) {
                existingProduct.quantity += 1;

            } else {
                cart.products.push({ product: pid, quantity: 1});

            }

            await cartModel.updateOne({_id: cid}, {products: cart.products});
            console.log("Producto agregado al carrito correctamente.")
            return true;

        } catch (error) {
            console.log("Error! No se pudo agregar el producto al carrito!", error);
            return false;
        }
    }

    // borrar carrito por id
    async deleteCartById(cartId) {
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

}
