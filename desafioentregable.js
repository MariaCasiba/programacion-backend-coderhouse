const fs = require("fs");

// class ProductManager 
class ProductManager {
    constructor() {
        this.path = "Products.json";
        this.products = [];
        this.createFile();
    }

    createFile() {
        if (!fs.existsSync(this.path)) {
            this.saveProducts();
        }
    }

    async getProducts() {
        let products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products) || [];
    }

    async saveProducts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    }


    async addProduct(title, description, price, thumbnail, code, stock) {

        if (await this.isCodeRepeated(code)) {
            console.log("Error! Código repetido");

        } else {
            const product = {
                id: await this.getId(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };

            this.products = await this.getProducts();
            this.products.push(product);
            await this.saveProducts();
            console.log("Producto agregado");
        }
            
    }

    async updateProduct(id, product) {
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
    }

    async deleteProduct(id) {
        this.products = await this.getProducts();
        const productIndex = this.products.findIndex((prod) => prod.id === id);
        if (productIndex === -1) {
            console.log("Error! Producto con id " + id + " no encontrado.")
        } else {
            this.products.splice(productIndex, 1);
            await this.saveProducts();
            console.log("Producto con id: " + id + " eliminado.");
        }
    }

    async getId() {
        const products = await this.getProducts();
        return products.length + 1;
    }

    async isCodeRepeated(code) {
        this.products = await this.getProducts();
        return this.products.some((product) => product.code === code);
    }

    async getProductById(id) {
        this.products = await this.getProducts();
        return this.products.find((product) => product.id === id) || "No se encontró el producto con id: " + id;
    }
}


// Proceso de testing

async function ejecutarTesting() {
    // Crear una instancia de ProductManager
    const productManager = new ProductManager();

    // Llamar a getProducts; se obtiene un array vacío
    console.log(await productManager.getProducts());

    // Agregar un producto
    await productManager.addProduct(
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        "abc123",
        25
    );
    //agrego producto con codigo repetido
    await productManager.addProduct(
        "producto prueba2",
        "Este es un producto prueba 2",
        300,
        "Sin imagen",
        "abc123",
        20
    );

    // Llamar nuevamente al método getProducts, aparece el producto agregado en el array
    console.log(await productManager.getProducts());

    // Buscar un producto por el id; mostrar mensaje de error si no lo encuentra o mostrar el producto si lo encuentra
    console.log(await productManager.getProductById(1));
    console.log(await productManager.getProductById(3));

    // Actualizar un producto
    await productManager.updateProduct(1, {
        title: "producto prueba actualizado",
        description: "Este es un producto prueba actualizado",
        price: 500,
        thumbnail: "Sin imagen",
        code: "abc125",
        stock: 21
    });
    console.log(await productManager.getProducts());

    // Llamar al método deleteProduct y eliminar un producto, o que arroje error en caso de no existir.
    await productManager.deleteProduct(1);
    await productManager.deleteProduct(5);
}

// Ejecutar las pruebas
ejecutarTesting();
