import { productModel } from "./models/product.model.js";

export class ProductService {
    
    constructor(){
        this.model = productModel;
    }

    // obtener todos los productos
    getProducts = async ({ limit, page, query, sortOptions}) => {
        const products = await productModel.paginate(query, { limit, page, sort: sortOptions });
        return products;
    }

    // obtener los productos por id
    getProductById = async (pid) => {
        const product = await productModel.findById(pid);
        return product || "No se encontró el producto con id: " + pid;
    }

    // agregar producto
    addProduct = async ({ title, description, code, price, status, stock, category, thumbnails }) => {
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
    }

    // actualizar producto
    updateProduct = async (id, product) => {
        const updatedProduct = await productModel.findByIdAndUpdate(id, product, { new: true });
        if (updatedProduct) {
            console.log("Producto con id: " + id + " actualizado", updatedProduct);
            return true;
        } else {
            console.log("Producto con id: " + id + " no encontrado");
            return false;
        }
    }

    // eliminar producto
    deleteProduct = async (id) => {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (deletedProduct) {
            console.log("Producto con id " + id + " eliminado correctamente");
            return true;
        } else {
            console.log("No se encontró el producto a eliminar");
            return false;
        }
    }

    //  verificar código
    isCodeRepeated = async (code) => {
        const existingProduct = await this.model.findOne({ code });
        return !!existingProduct;
    }
}

