import fs from "fs";

// class ProductManager 
export class ProductManager {
    constructor() {
        this.path = "./src/Products.json";
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
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
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
/*
// crear una instancia de ProductManager

const productManager = new ProductManager();

// función para agregar productos a Products.json

async function agregarProductos() {
    await productManager.addProduct("Vestido corto de terciopelo", "Vestido corto de terciopelo con cuello decorado con perlas, mangas largas con puños satinados con botones y una falda acampanada.", 45000, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwc516a05f/images/h13/Sandro_SFPRO03338-20_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc1", 15);
    await productManager.addProduct("Vestido satinado con volantes", "Vestido con efecto superpuesto y satinado con mangas largas, cuello redondo, fruncidos y volantes en el lateral.", 48000, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwbbe7d0f9/images/h13/Sandro_SFPRO03284-11_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc2", 12);
    await productManager.addProduct("Blusa con lazo en el cuello", "Blusa fluida de velo con lazo en el cuello, manga larga con puños elásticos con volantes y cierre de botones. ", 39000, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dweb37c521/images/h13/Sandro_SFPCM00979-11_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc3", 18);
    await productManager.addProduct("Top con estrás", "Top fruncido de mesh con cuello redondo trenzado y abierto, con manga larga y totalmente adornado con estrás.", 33000, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dw11589410/images/h13/Sandro_SFPTS01328-20_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc4", 20);
    await productManager.addProduct("Pantalón a rayas", "Pantalón plisado decorado con finas rayas y con un cinturón de hebilla metálica con las siglas de la marca en la cintura. ", 36800, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwf6791a04/images/h13/Sandro_SFPPA01345-D234_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc5", 18);
    await productManager.addProduct("Pantalón de jeans deshilachado", "Pantalón de jeans desteñido de pierna ancha con bordes sin coser en los tobillos y cinco bolsillos.", 38200, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dw9cf050f3/images/h13/Sandro_SFPJE00557-20_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc6", 22);
    await productManager.addProduct("Chaqueta bomber de cuero", "Chaqueta bomber de cuero de corte ancho con cuello de piel de borrego, bolsillos laterales con solapa y cierre de cremallera.", 48200, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwa436c679/images/h13/Sandro_SFPBL00830-G023_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc7", 16);
    await productManager.addProduct("Abrigo largo", "Abrigo largo con botones cruzados y amplio cuello de sastre con dobladillo de terciopelo, con bolsillos con solapa. ", 56200, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dw424a97fb/images/h13/Sandro_SFPOU00561-20_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc8", 15);
    await productManager.addProduct("Falda corta plisada de punto", "Falda corta plisada y evasé de punto pointelle, sublimada con bandas en contraste.", 36200, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwda3998b6/images/h13/Sandro_SFPJU00902-11_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc9", 21);
    await productManager.addProduct("Falda corta de tweed", "Falda corta de tweed con bolsillos de ojal con botones en la cintura, sublimada con motivo pata de gallo.", 46200, "https://es.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Sites-sandro-catalog-master-H13/default/dwb6f57a85/images/h13/Sandro_SFPJU00944-420_V_1.jpg?sw=1156&cx=221&cy=0&cw=1547&ch=2000", "abc10", 18);

    console.log(await productManager.getProducts());
}

agregarProductos();
*/




