import  { productService } from "../repositories/service.js";
import CustomError from "../services/errors/CustomError.js";
import generateProductsErrorInfo from "../services/errors/generateProductsErrorInfo.js";
import EErrors from "../services/errors/enums.js";


class ProductController {
    constructor() {
        this.productService = productService;
    }

    // obtener productos

    getProducts = async (req, res, next) => {
        try {
            const { limit = 10, page = 1, sort } = req.query;
            const category = req.query.category; 
    
            const sortOptions = {};
            if (sort === "asc") {
                sortOptions.price = 1;
            } else if (sort === "desc") {
                sortOptions.price = -1;
            }
    
            const query = {}; 
            if (category) {
                query.category = category;             }
    
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
            req.logger.error("Error en la ruta GET /products", error);
            const databaseError = CustomError.createError({
                name: 'Database error',
                message: 'Error trying to fetch products from database',
                code: EErrors.DATABASE_ERROR
            });
            next(databaseError);
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
                    cause: "product not found",
                    message: `No se encontró el producto con id ${pid}`,
                    code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                    
                });

                throw productNotFoundError;
            }
        } catch (error) {
            req.logger.error("Error en la ruta GET /products/:pid", error);
            next(error);
        }
    }

    // agregar producto
    addProduct = async (req, res, next) => {
        
        try {
            
            const user = req.user;
            
            const owner = user && user.role === "premium" ? user.email : "admin";
            console.log("owner en controller: ", owner)

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
                status, 
                owner
            });
            if (productAdded) {
                req.logger.info("Producto agregado correctamente")
                res.status(200).send({ status:"ok", message: "Producto agregado correctamente"})
            } else {
                res.status(500).send({ status: "error", message: "Error del servidor. No se pudo agregar el producto"});
            }
        } catch (error) {
            req.logger.error("Error en la ruta POST /products", error)
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
                    message: `Error trying to update product with id ${pid}`,
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
                req.logger.info("Producto actualizado correctamente")
                res.status(200).send({status: "success",message: `El producto con id ${pid} se actualizó correctamente`});
            } else {
                res.status(500).send({status: "error", message: `Error! No se pudo actualizar el producto con id ${pid}`})
            }
        } catch (error) {
            req.logger.error("Error en la ruta PUT /products/:pid", error);
            next(error)
        }
    }

    // borrar producto
    deleteProduct = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const productDeleted = await this.productService.deleteProduct(pid);
            if (productDeleted) {
                req.logger.info(`Producto con id ${pid} eliminado correctamente`);
                res.status(200).send({status: "success",message: `El producto con id ${pid} se eliminó correctamente!`});
            } else {
                res.status(500).send({status: "error",message: `Error. No se pudo eliminar el producto con id ${pid}`});
            }
        } catch (error) {
            req.logger.error("Error en la ruta DELETE /products/:pid", error);
            next(error);
        }
    }
}

export default ProductController;
