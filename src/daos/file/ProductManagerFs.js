import fs from "fs";

const productsPath = "./src/mockDB/Products.json";

// class ProductManager 

export class ProductManager {
    constructor() {
        this.path = productsPath;
        this.products = [];
        this.createFile();
    }

    async createFile() {
        try {
            await fs.promises.access(this.path, fs.constants.R_OK | fs.constants.W_OK)
            
        } catch (error) {
            await this.saveProducts();
        }
    }

    async readFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            //console.log(data);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        } 
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log("Error al guardar productos", error);
        }
    };

// obtener todos los productos

    async getProducts() {
        try {
            return await this.readFile();
        } catch (error) {
            console.error("Error al obtener todos los productos", error);
            return [];
        }
    } 

// obtener producto por su id
    async getProductById(id) {
        try {
            this.products = await this.getProducts();
            return this.products.find((product) => product.id === id) || "No se encontró el producto con id: " + id;
        } catch (error) {
            console.error("Error al obtener el producto por su id", error);
            return null;
        }
    }

// agregar producto

    async addProduct({title, description, code, price, status, stock, category, thumbnails}) {
        try {
            if (await this.isCodeRepeated(code)) {
                console.log("Error! Código repetido");
                return false;
            } 
            
            const product = {
                id: await this.getId(),
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };
    
                this.products = await this.getProducts();
                this.products.push(product);
                await this.saveProducts();
                console.log("Producto agregado");
                return true;

        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    };

// actualizar producto

    async updateProduct(id, product) {
        try {
            this.products = await this.getProducts();
            const productIndex = this.products.findIndex((prod) => prod.id === id);
            if (productIndex === -1) {
                console.log("Error! Producto con id:" + id + "no encontrado.");
            } else {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    ...product,
                    id:id,
                };
                await this.saveProducts();
                console.log("Producto con id: " + id + " actualizado.");
            }
        } catch (error) {
            console.error("Error actualizar el producto", error);
        }
    }

// eliminar producto

    async deleteProduct(id) {
        try {
            this.products = await this.getProducts();
            const productIndex = this.products.findIndex((prod) => prod.id === id);

            if (productIndex === -1) {
                console.log("Error! Producto con id " + id + " no encontrado.")
                return false;
            } 

            this.products.splice(productIndex, 1);
            await this.saveProducts();
            console.log("Producto con id: " + id + " eliminado.");
            return true;
        
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            return false;
        } 
    }

// obtener id 

    async getId() {
        try {
            const products = await this.getProducts();
            return products.length + 1;
        } catch (error) {
            console.error("Error al crear id del producto", error);
            return null;
        }

    }


    async isCodeRepeated(code) {
        try {
            this.products = await this.getProducts();
            return this.products.some((product) => product.code === code);
        } catch(error) {
            console.error("Error al controlar repetición del code", error);
            return false;
        }
    }


}

