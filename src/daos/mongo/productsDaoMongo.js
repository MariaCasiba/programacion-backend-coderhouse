import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";


export class ProductService {
    
    constructor(){
        this.model = productModel;
    }
    // obtener todos los productos  
        async getProducts(limit) {
            try {
                
                return await limit? productModel.find().limit(limit) : productModel.find().lean();

            } catch (error) {
            console.error("Error al obtener todos los productos", error);
            return [];
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
        
        /*
        async isCodeRepeated(code) {
            try {
                return await productModel.findOne({code:code}) || false;

            } catch (error) {
                console.error("Error al verificar la repetición del código", error);
                return false;
            }
        }*/
        
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

