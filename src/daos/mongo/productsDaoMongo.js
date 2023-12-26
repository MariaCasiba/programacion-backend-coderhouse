import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";


export class ProductService {
    
    constructor(){
        this.model = productModel;
    }
    // obtener todos los productos  
    async getProducts(params) {

        try {

        let { limit, page, query, sort } = params;
    
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        query = query? JSON.parse(query) : {};
    
        if (sort === "asc") {
            sort = 1;
        } else if (sort === "desc") {
            sort = -1;
        } else {
            sort = 0;
        }
    
        let products = await productModel.paginate(query, { limit: limit, page: page, sort: sort ? { price: sort } : {} });
        let status = products ? "success" : "error";

        let prevLink = products.hasPrevPage ? "http://localhost:8080?limit=" + limit + "&page=" + products.prevPage : null;
        let nextLink = products.hasNextPage ? "http://localhost:8080?limit=" + limit + "&page=" + products.nextPage : null;
    
        return {
            status: status,
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };


        } catch (error) {
            console.error("Error al obtener los productos", error);
            return  {
                status: "error",
                payload: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
        };
    }
}
        
        // obtener producto por id
        async getProductById(pid) {
            try {
            const product = await productModel.findById({_id: pid});
            return product || "No se encontró el producto con id: " + pid;

            } catch (error) {
            console.error("Error al obtener el producto por su id", error);
            return null;
            }
        }
        
        // agregar producto
        async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
            try {
            if (await this.isCodeRepeated(code)) {
                console.log("Error! Código repetido");
                return false;
            }
        
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
            return false;
            }
        }
        
        // actualizar producto
        async updateProduct(id, product) {
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
            return false;
            }
        }
        
        // borrar producto
        async deleteProduct(id) {
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
            return false;
            }
        }
        
        async isCodeRepeated(code) {
            try {
                const existingProduct = await this.model.findOne({ code });
                return !!existingProduct;
            } catch (error) {
                console.error("Error al verificar la repetición del código", error);
                return false;
            }
        }
        
    

} 

