import  { productService } from "../repositories/service.js";
import CustomError from "../services/errors/CustomError.js";
import generateProductsErrorInfo from "../services/errors/generateProductsErrorInfo.js";
import EErrors from "../services/errors/enums.js";

class ProductController {
    constructor() {
        this.productService = productService;
    }

    
getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = {}, sort } = req.query;
        
        const sortOptions = {};
        if (sort === "asc") {
            sortOptions.price = 1;
        } else if (sort === "desc") {
            sortOptions.price = -1;
        }

        const products = await this.productService.getProducts({ limit, page, query, sortOptions });
        
        res.send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage
        });

    } catch (error) {
        const databaseError = CustomError.createError({
            name: 'Database error',
            message: 'Error trying to fetch products from database',
            code: EErrors.DATABASE_ERROR
        })
        next(error)
    }
}


    // obtener productos por su id
    getProductById = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const product = await this.productService.getProductById(pid);

            if(product) {
                res.send({status: "success", payload: product });
            } else {
                const productNotFoundError = CustomError.createError({
                    name: 'Product not found',
                    message: `Error! Producto con id ${pid} no encontrado en la base de datos`,
                    code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                    cause: "product not found"
                });
                throw productNotFoundError
            }
        } catch (error) {
            next(error);
        }
    }

    // agregar producto
    addProduct = async (req, res, next) => {
        try {
            let { title, description, code, price, stock, category, thumbnails, status } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                
                const error = CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductsErrorInfo({title, description, code, price, stock, category, thumbnails}),
                    message: 'Error trying to create new product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
                throw error;
            }
            status = !status && true;
            thumbnails = thumbnails || [];
            const productAdded = await this.productService.addProduct({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
                status
            });
            if (productAdded) {
                res.status(200).send({ status:"ok", message: "Producto agregado correctamente"})
            } else {
                res.status(500).send({ status: "error", message: "Error del servidor. No se pudo agregar el producto"});
            }
        } catch (error) {
            next(error)
        }
    }

    // actualizar producto
    updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params;
            let { title, description, code, price, stock, category, thumbnails, status } = req.body;
            
            if (!title || !description || !code || !price || !stock || !category) {
                const error = CustomError.createError({
                    name: 'Product update error',
                    cause: generateProductsErrorInfo({title, description, code, price, stock, category, thumbnails}),
                    message: 'Error trying to update new product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
                throw error;
                
            }
            status = !status && true;
            thumbnails = thumbnails || [];
            const productUpdated = await this.productService.updateProduct(pid, {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
                status
            });
            if(productUpdated) {
                res.status(200).send({status: "success",message: "El producto se actualizó correctamente"});
            } else {
                res.status(500).send({status: "error", message: "Error! No se pudo actualizar el producto"})
            }
        } catch (error) {
            next(error)
        }
    }

    // borrar producto
    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const productDeleted = await this.productService.deleteProduct(pid);
            if (productDeleted) {
                console.log("Producto eliminado correctamente");
                res.status(200).send({status: "success",message: "El Producto se eliminó correctamente!"});
            } else {
                res.status(500).send({status: "error",message: "Error. No se pudo eliminar el producto."});
            }
        } catch (error) {
            console.error("Error en la ruta DELETE /products/:pid", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor. No se pudo borrar el producto.",
            });
        }
    }
}

export default ProductController;
