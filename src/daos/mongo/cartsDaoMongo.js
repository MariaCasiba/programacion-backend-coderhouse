import mongoose from "mongoose";
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
        console.log("Carrito creado con id: ", newCart._id);
        return newCart._id;

        } catch (error) {
        console.error("Error al crear el carrito", error);
        return null;
        }
    }



    // obtener carrito por id
    async getCartById(cid) {
        try {

            if (!cid) {
                console.log("Id del carrito es undefined.");
                return null;
            }

            const cart = await cartModel.findOne({_id: cid}).populate('products.product');
        

            if(!cart) {
                console.log(`Carrito con id ${cid} no encontrado`);
                return null;
            }

            return cart; 

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


// agregar producto al carrito
    async addProductToCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            const product = await productModel.findById(pid);

            if (!cart || !product) {
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


// eliminar todos los productos del carrito por id
    async deleteAllProductsInCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("No se encontró el carrito!");
                return false;
            }

            cart.products = []; 

            await cartModel.updateOne({ _id: cartId }, { products: cart.products });
            console.log("Se eliminaron todos los productos del carrito correctamente.");
            return true;

        } catch (error) {
            console.log("Error! No se pudieron eliminar todos los productos del carrito.", error);
            return false;
        }
    }


// eliminar carrito por id
/*
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
*/

// eliminar un producto del carrito por id de carrito y id de producto
async deleteProductInCart(cartId, productId) {
    try {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            console.log("No se encontró el carrito!");
            return false;
        }

        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        await cartModel.updateOne({ _id: cartId }, { products: cart.products });
        console.log("Producto eliminado del carrito correctamente.");
        return true;

    } catch (error) {
        console.log("Error! No se pudo eliminar el producto del carrito.", error);
        return false;
    }
}

// actualizar todos los productos del carrito
async updateAllProductsInCart(cid, updatedProducts) {
    try {
        const cart = await this.getCartById(cid);

        if (!cart) {
            console.log("No se encontró el carrito.");
            return false;
        }

        if (!Array.isArray(updatedProducts)) {
            console.log("El formato es incorrecto.");
            return false;
        }

        for (const updatedProduct of updatedProducts) {
            console.log("updatedProduct: ", updatedProduct)
            const updatedProductIdString = updatedProduct.product.toString();
            const existingProduct = cart.products.find(item => item.product && item.product._id.toString() === updatedProductIdString);

            if (existingProduct) {
                existingProduct.quantity = updatedProduct.quantity;
            } else {
                const product = await productModel.findById(updatedProduct.product.toString()).lean();
                
                if (product) {
                    console.log("product: ", product)
                    cart.products.push({
                        product: product, 
                        quantity: updatedProduct.quantity
                    });
                    console.log("cart.products: ", cart.products)

                } else {
                    console.log(`El producto con ID ${updatedProduct.product} no existe.`);
                }
            }
        }

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Carrito actualizado correctamente.");
        return true;
    } catch (error) {
        console.log("Error! No se pudo actualizar el carrito:", error);
        return false;
    }
}


// actualizar la cantidad de un producto en el carrito 

async updateProductQuantity(cid, pid, quantity) {
    try {
        const cart = await this.getCartById(cid);

        if (!cart) {
            console.log("No se encontró el carrito.");
            return false;
        }

        const existingProduct = cart.products.find(item => item.product._id.toString() === pid);

        if (!existingProduct) {
            console.log("No se encontró el producto en el carrito.");
            return false;
        }

        if (quantity >= 0) {
            existingProduct.quantity = quantity;
        } else {
            console.log("La nueva cantidad debe ser 0 o un número mayor a 0.");
            return false;
        }

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Cantidad de producto actualizada correctamente.");
        return true;
    } catch (error) {
        console.log("Error! No se pudo actualizar la cantidad del producto:", error);
        return false;
    }
}


}
