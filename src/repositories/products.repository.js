import { ProductService } from '../daos/mongo/productsDaoMongo.js';

class ProductRepository {
    constructor() {
        this.productsService = new ProductService();
    }

    async getProducts({ limit, page, query, sortOptions }) {
        try {
            const products = await this.productsService.getProducts({ limit, page, query, sortOptions });
            return products;
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.productsService.getProductById(pid);
            return product || null;
        } catch (error) {
            console.error("Error al obtener el producto por su id", error);
            throw error;
        }
    }

    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        try {
            const newProduct = await this.productsService.addProduct({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            });
            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            const updatedProduct = await this.productsService.updateProduct(id, product);
            return updatedProduct || null;
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await this.productsService.deleteProduct(id);
            return deletedProduct !== null;
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }

    async isCodeRepeated(code) {
        try {
            const isRepeated = await this.productsService.isCodeRepeated(code);
            return isRepeated;
        } catch (error) {
            console.error("Error al verificar la repetición del código", error);
            throw error;
        }
    }
}

export default ProductRepository;
