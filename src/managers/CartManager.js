import fs from "fs";

const cartPath = "./src/mockDB/Carts.json";

export class CartManager {
    constructor() {
        this.carts = [];
        this.path = cartPath;
        this.createFile();
    }

    async createFile() {
        try {
            await fs.promises.access(this.path, fs.constants.R_OK | fs.constants.W_OK);
        } catch (error) {
            await this.saveCart();
        }
    } 
    

    async readFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data) || [];
        } catch (error) {
            console.error("Error al leer el archivo", error);
            return [];
        }
    }

    async saveCart() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar el carrito", error);
        }
    }

// crear carrito

    async newCart() {
        try {
            const newCart = {
                id: await this.getId(), 
                products: []
            };

            this.carts.push(newCart);
            await this.saveCart();
            console.log("Se creó un nuevo carrito");
            return newCart;

        } catch (error) {
            console.error("Error al crear el carrito", error);
            return null;
        }
    }


// obtener carrito por su id

    async getCartById(id) {
        try {
            this.carts = await this.readFile();
            const cart = this.carts.find(item => item.id === id);

            if (cart) {
                return cart
            } else {
                console.log("Error, no se encuentra el carrito solicitado");
            }
        } catch (error) {
            console.error("Error al obtener el carrito por su id", error);
            return null;
        }
    };

// obtener todos los carritos

async getCarts() {
    try {
        this.carts = await this.readFile();
        return this.carts;
    } catch (error) {
        console.error("Error al obtener los carritos", error);
        return [];
    }
};


// agregar un producto al carrito

    async addProductToCart(cid, pid) { 
        try {
            this.carts = await this.getCarts();
            const cart = this.carts.find(item => item.id === cid)
            let product = cart.products.find(item => item.product === pid);

            if (product) {
                product.quantity += 1;
            } else {
                cart.products.push({product:pid, quantity:1});
            }

            await this.saveCart();
            console.log("Producto agregado.");
            return true;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            return false;
        }
    }

// crear id del carrito

    async getId() {
        try {
            this.carts = await this.getCarts();
            return this.carts.length + 1;
        } catch (error) {
            console.error("Error al obtener el id del carrito", error);
            return null;
        }
        
    }
}