import { cartService, productService, ticketService } from "../repositories/service.js";
import { sendMail }  from "../utils/sendMail.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

class CartController {
    constructor() {
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService;
    }
    
    //  crear un nuevo carrito
    createCart = async (req, res) => {
        try {
            const cartId = await this.cartService.createCart();
        
            if (cartId) {
                return res.status(200).json({ status: "success", payload: { _id: cartId._id }, message: "El carrito se creó correctamente" });
            } else {
                return res.status(500).json({status: "error", message: "Error! No se pudo crear el carrito"})
            }
        } catch (error) {
            console.error("Error en la ruta POST /carts", error);
            res.status(500).json({ status: "error", message: "Error del servidor al crear o obtener el carrito." });
        }
    }


    // Obtener un carrito por su id
    getCartById = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartService.getCartById(cid);
        
            if(cart) {
                res.send({status: "success", payload: cart });
            } else {
                const cartNotFoundError = CustomError.createError({
                    name: 'Cart not found',
                    message: `Error! Cart con id ${cid} no encontrado en la base de datos`,
                    code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                    cause: "Cart not found"
                });
                throw cartNotFoundError
            }

        } catch (error) {
            next(error)
        }
    }


    // obtener todos los carritos
    getCarts = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts();
        
            if (carts) {
                res.send({status: "success", payload: carts });
            } else {
                res.status(400).send({
                    status: "error",
                    message: "Error! No se encontraron carritos."
                });
            }
        } catch (error) {
            console.error("Error en la ruta GET /carts/", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor al obtener los carritos."
            });
        }
    }

    
    // eliminar un carrito por su id
    deleteCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const deletedCart = await this.cartService.deleteCartById(cid);
        
            if (deletedCart) {
                res.status(200).send({
                    status: "success",
                    message: "Carrito eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    status: "error",
                    message: "No se encontró el carrito a eliminar"
                });
            }
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid", error);
            res.status(500).send({
                status: "error",
                message: "Error del servidor al eliminar el carrito"
            });
        }
    }

    // agregar producto al carrito
    addProductToCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
    
            if (!cid || !pid) {
                return res.status(400).send({ status: "error", message: "El ID del carrito o del producto no fueron proporcionados." });
            }
    
            const cart = await this.cartService.getCartById(cid);
            const product = await this.productService.getProductById(pid); 
    
            if (!cart || !product) {
                const cartProductNotFoundError = CustomError.createError({
                    name: 'Cart or Product not found',
                    message: 'Error! No se encontró el carrito o el producto',
                    code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                    cause: 'Producto o carrito no encontrado'
                })
                throw cartProductNotFoundError
            }
    
            const existingProduct = cart.products.find(item => item.product.equals(product._id));
    
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: product._id, quantity: 1 });
            }
    
            const result = await this.cartService.updateCartProducts(cid, cart.products);
    
            if (result) {
                return res.status(200).send({ status: "success", message: "El producto se agregó correctamente o se actualizó la cantidad." });
            } else {
                const addToCartError = CustomError.createError({
                    name: 'Add to Cart Error',
                    message: 'No se pudo agregar el producto al carrito',
                    code: EErrors.DATABASE_ERROR,
                    cause: 'No se agregó el producto al carrito'
                })
                throw addToCartError;
            }
        } catch (error) {
            next(error)
        }
    }

    // borrar todos los productos del carrito 
    deleteAllProductsInCart = async (req, res) => {
        try {
            const { cid } = req.params;

            const result = await this.cartService.deleteAllProductsInCart(cid);

            if (result) {
                res.status(200).send({ status: "success", message: "Todos los productos del carrito fueron eliminados correctamente." });
            } else {
                res.status(404).send({ status: "error", message: "Error! No se pudieron eliminar todos los productos del carrito." });
            }

        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid/products", error);
            res.status(500).send({ status: "error", message: "Error del servidor al eliminar todos los productos del carrito." });
        }
    }



    // eliminar un producto del carrito
    deleteProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;      
            const cart = await this.cartService.getCartById(cid);
    
            if (!cart) {
                return res.status(404).send({ status: "error", message: "No se encontró el carrito." });
            }  
            
            const updatedProducts = cart.products.filter(item => !item.product.equals(pid));
            
            const result = await this.cartService.updateCartProducts(cid, updatedProducts);
    
            if (result) {
                return res.status(200).send({ status: "success", message: "Producto eliminado del carrito correctamente." });
            } else {
                return res.status(404).send({ status: "error", message: "Error al eliminar el producto del carrito." });
            }
        } catch (error) {
            console.error("Error en la ruta DELETE /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al eliminar el producto del carrito." });
        }
    }

    // actualizar los productos del carrito
    updateAllProductsInCart = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const updatedProducts = req.body;
            
            const cart = await this.cartService.getCartById(cid);
            if (!cart) {
                const cartNotFoundError = CustomError.createError({
                    name: 'Cart not found',
                    message: `Error! No se encontró el carrito con ID ${cid}.`,
                    code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                    cause: 'No se encontró el carrito'
                });
                throw cartNotFoundError;
            }

            cart.products = [];
            
            for (const updatedProduct of updatedProducts) {
                const product = await this.productService.getProductById(updatedProduct.productId);
                if (!product) {
                    const productNotFoundError = CustomError.createError({
                        name: 'Product not found',
                        message: `Error! No se encontró el producto con ID ${updatedProduct.productId}.`,
                        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
                        cause: 'No se encontró el producto.'
                    });
                    throw productNotFoundError;
                }
                cart.products.push({ product: product._id, quantity: updatedProduct.quantity });
            }
            
            const result = await this.cartService.updateCartProducts(cid, cart.products);
            if (result) {
                return res.status(200).send({ status: "success", message: "Carrito actualizado correctamente." });
            } else {
                const updateCartError = CustomError.createError({
                    name: 'Update Cart Error',
                    message: 'Error! No se pudo actualizar el carrito.',
                    code: EErrors.DATABASE_ERROR,
                    cause: 'No se puedo actualizar el carrito'
                });
                throw updateCartError;
            }
        } catch (error) {
            next(error)
        }
    }

    // actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
    
            // Validar que la cantidad sea un número mayor o igual a cero
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).send({ status: "error", message: "La nueva cantidad debe ser un número mayor o igual a 0." });
            }
    
            const result = await this.cartService.updateProductQuantity(cid, pid, quantity);
    
            if (result) {
                res.status(200).send({ status: "success", message: "Cantidad de producto en el carrito actualizada correctamente." });
            } else {
                res.status(404).send({ status: "error", message: "Error! No se pudo actualizar la cantidad del producto en el carrito." });
            }
        } catch (error) {
            console.error("Error en la ruta PUT /carts/:cid/products/:pid", error);
            res.status(500).send({ status: "error", message: "Error del servidor al actualizar la cantidad del producto en el carrito." });
        }
    }
    

    // creat ticket de compra
    createPurchaseTicket = async (req, res) => {
        try {
            console.log("Entrando en la función createPurchaseTicket"); 

            if (!req.user || !req.user.id) {
                console.error("req.user no está definido");
                return res.status(400).json({ error: "Usuario no definido" });
            }

            const { cid } = req.params;
            console.log("cid en createPurchaseTicket: ", cid)

            const cart = await this.cartService.getCartById(cid);

            if (!cart) {
                console.log("Carrito no encontrado");
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            console.log("Productos en el carrito:", cart.products);

            const productsToPurchase = cart.products;
            // stock
            const productsOutOfStock = [];
            const productsSucessfulPurchase = [];

            for (const item of productsToPurchase) {
                const product = await this.productService.getProductById(item.product);
                if (!product) {
                    console.error(`Producto ${item.product} no encontrado`)
                    productsOutOfStock.push(item)
                    continue;
                } 

                if (product.stock < item.quantity) {
                    console.error(
                        `No hay stock del producto ${JSON.stringify(item.product)}`
                    )
                    productsOutOfStock.push(item);

                } else {
                    productsSucessfulPurchase.push(item);
                    const existingProduct = await this.productService.getProductById(item.product);

                    const updatedStock = existingProduct.stock - item.quantity;
                    await this.productService.updateProduct(item.product, { 
                        title: existingProduct.title,
                        description: existingProduct.description,
                        code: existingProduct.code,
                        price: existingProduct.price,
                        stock: updatedStock,
                        category: existingProduct.category,
                        thumbnails: existingProduct.thumbnails,
                        status: existingProduct.status,
                        });
                    
                }
            }
            
            await this.cartService.updateCartProducts(cid, productsOutOfStock);

            if (productsSucessfulPurchase.length === 0) {
                console.error("No se pudo completar  la compra de los productos seleccionados debido a falta de stock: ", productsOutOfStock)
                return res.status(400).json({
                    error: "No se pudo completar la compra de los productos seleccionados",
                    productsOutOfStock,
                })
            }

            console.log("productSucessfulPurchase: ", productsSucessfulPurchase)
            const totalAmount = productsSucessfulPurchase.reduce((total, product) => {
                return total + product.product.price * product.quantity;
            }, 0);

            console.log("totalAmount: ", totalAmount)

            
            // ticket
            const ticketData = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email
            };

            const newTicket = await this.ticketService.createTicket(ticketData);
            
            let htmlContent = `
            <div>
                <h1>¡Gracias por tu compra!</h1>
                <p>Detalles de la compra:</p>
                <ul>
            `;

            productsSucessfulPurchase.forEach((product, index) => {
                htmlContent += `<li>${index + 1}. ${product.product.title}: $${product.product.price}, Cantidad: ${product.quantity}</li>`;
            });

            htmlContent += `
                    </ul>
                    <p>El Total de la compra es: $${totalAmount}.</p>
                </div>
            `;

            await sendMail(req.user.email, 'Compra realizada con éxito', htmlContent);

            res.json({
                status: "success",
                message: "Se completó la compra de los productos seleccionados.",
                ticket: newTicket,
                productsOutOfStock: productsOutOfStock.length > 0 ? productsOutOfStock.map(item => item.product) : undefined
            });    

        
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }


    
}


function generateUniqueCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}




export default CartController;