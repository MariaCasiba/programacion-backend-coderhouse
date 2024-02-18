import { productModel } from "./models/product.model.js";

export class ProductService {
    
    constructor(){
        this.model = productModel;
    }

    // obtener los productos
    getProducts = async ({ limit = 10, page = 1, query = {}, sort = 'asc' }) => {
        try {

            const sortOptions = {};
            if (sort === "asc") {
                sortOptions.price = 1;
            } else if (sort === "desc") {
                sortOptions.price = -1;
            }

            const products = await productModel.paginate(query, { limit, page, sort: sortOptions });
            
            return products;
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    // obtener los productos por id
    getProductById = async (pid) => {
        try {
            const product = await productModel.findById(pid);
            return product || "No se encontró el producto con id: " + pid;
        } catch (error) {
            console.error("Error al obtener el producto por su id", error);
            throw error;
        }
    }

    // agregar producto
    addProduct = async ({ title, description, code, price, status, stock, category, thumbnails }) => {
        try {
            const newProduct = await productModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            });
            console.log("Producto agregado");
            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    }

    // actualizar producto
    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, product, { new: true });
            if (updatedProduct) {
                console.log("Producto con id: " + id + " actualizado", updatedProduct);
                return true;
            } else {
                console.log("Producto con id: " + id + " no encontrado");
                return false;
            }
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    // eliminar producto
    deleteProduct = async (id) => {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (deletedProduct) {
                console.log("Producto con id " + id + " eliminado correctamente");
                return true;
            } else {
                console.log("No se encontró el producto a eliminar")
                return false;
            }
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }

    //  verificar código
    isCodeRepeated = async (code) => {
        try {
            const existingProduct = await this.model.findOne({ code });
            return !!existingProduct;
        } catch (error) {
            console.error("Error al verificar la repetición del código", error);
            throw error;
        }
    }
}
