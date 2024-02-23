import  { productService } from "../repositories/service.js"

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
        console.log("products: ", products)
        
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
        console.error("Error al obtener los productos en la ruta GET", error);
        res.status(500).send({ status: "error", message: "Error del servidor al obtener los productos" });
    }
}


    // obtener productos por su id
    getProductById = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await this.productService.getProductById(pid);
            if(product) {
                res.send({status: "success", payload: product });
            } else {
                res.status(404).send({status: "error", message: "Error! Producto con id no encontrado!"});
            }
        } catch (error) {
            console.error("Error en la ruta GET /products/:pid", error);
            res.status(500).send({ status: "error", message: "Error interno del servidor" });
        }
    }

    // agregar producto
    addProduct = async (req, res) => {
        try {
            let { title, description, code, price, stock, category, thumbnails, status } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
                return false;
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
            console.error("Error en la ruta POST /products", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor! No se pudo agregar el producto",
            });
        }
    }

    // actualizar producto
    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            let { title, description, code, price, stock, category, thumbnails, status } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
                return false;
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
            console.error("Error en la ruta PUT /products/:pid", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor. No se pudo actualizar el producto",
            });
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
