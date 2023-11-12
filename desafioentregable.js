// class ProductManager 
class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (this.isCodeRepeated(code)) {
            console.log("Error! Código repetido");
        } else if (title && description && price && thumbnail && code && stock) {
            const product = {
                id: this.getId(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            };
            this.products.push(product);
        } else {
            console.log("Error! Falta un campo obligatorio");
        }
    }

    getId() {
        return this.products.length + 1;
    }

    isCodeRepeated(code) {
        return this.products.some((product) => product.code === code);
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            console.log("Error! No se encontró el producto");
        } else {
            console.log(product);
            return product;
        }
    }
}

// Pruebas
// crear una instancia de productManager
const productManager = new ProductManager();
// llamar a getProducts, se obtiene un array vacío
console.log(productManager.getProducts());
//agregar un producto
productManager.addProduct("producto prueba", "este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager.getProducts());
// agregar un producto con el mismo codigo, se obtiene error
productManager.addProduct("producto prueba2", "este es un producto prueba2", 200, "Sin imagen", "abc123", 25);
// búsqueda de producto por id
productManager.getProductById(1);
productManager.getProductById(3); // error, no existe el id