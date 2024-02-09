import { ProductService } from '../daos/mongo/productsDaoMongo.js'

class ProductController {
    constructor() {
        this.productsService = new ProductService()

    }

    // obtener los productos
    getProducts = async (req, res) => {
        try {

            const products = await this.productsService.getProducts(req.query);
            console.log('req.query:', req.query);
            
            res.send({products});
        
          } catch (error) {
            console.error("Error al obtener los productos en la ruta GET", error);
            res.status(500).send({status: "error", message: "Error del servidor al obtener los productos"});
          }
    }

    // obtener productos por id
    getProductById = async (req, res) => {
        try {
            const { pid }  = req.params;
            const product = await this.productsService.getProductById(pid);
        
            if(product) {
              res.send({status: "success", payload: product });
            } else {
              res.status(404).send({status: "error", message: "Error! Producto con id no encontrado!"})
            }
            
          } catch (error) {
            console.error("Error en la ruta GET /products/:pid", error);
            res.status(500).send({ status: "error", message: "Error interno del servidor" });
          }
    }

    // agregar producto
    addProduct = async (req, res) => {
        try {
            let {title, description, code, price, stock, category, thumbnails, status} = req.body;
        
            if (!title || !description || !code || !price || !stock || !category) {
                res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
                return false;
            }
        
            status = !status && true;
            thumbnails = thumbnails || [];
        
            const productAdded = await this.productsService.addProduct({title, description, code, price, stock, category, thumbnails, status});
        
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
        
            let {title, description, code, price, stock, category, thumbnails, status} = req.body;
        
            if (!title || !description || !code || !price || !stock || !category) {
              res.status(400).send({status:"error", message: "Debe completar los campos faltantes"});
              return false;
          }
          
            status = !status && true;
            thumbnails = thumbnails || [];
        
            const productUpdated = await this.productsService.updateProduct(pid, {title, description, code, price, stock, status, category, thumbnails});  
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

    // eliminar producto
    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
        
            const productDeleted = await this.productsService.deleteProduct(pid);
        
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

export default ProductController