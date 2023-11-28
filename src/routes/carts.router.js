import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";

const cartsRouter = Router();

const cartsService = new CartManager();

// endpoint para crear un carrito

cartsRouter.post("/", async (req, res) => {
    try {
        if (await cartsService.newCart()) {
            res.status(200).send({status: "success", message: "El carrito se creó correctamente"});
        } else {
            res.status(500).send({status: "error", message: "Error! No se pudo crear el carrito"});
        }
    } catch (error) {
        console.error("Error en la ruta POST /carts", error);
        res.status(500).send({status: "error", message: "Error del servidor al crear el carrito."})
    }  
});

// endpoint para obtener carrito por id

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getCartById(parseInt(cid));
    
        if (cart) {
            res.send({products: cart.products})
        } else {
            res.status(400).send({status:"error", message:"Error! No se encuentra el Id de carrito solicitado."});
        } 
    } catch (error) {
        console.error("Error en la ruta GET /carts/:cid", error);
        res.status(500).send({status: "error", message: "Error del servido al obtener el carrito solicitado."})
    }
});


// endpoint para agregar un producto a un carrito 

    cartsRouter.post("/:cid/products/:pid", async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const cart = await cartsService.getCartById(parseInt(cid));


            if (!cart) {
                return res.status(404).send({status: "error", message: "Carrito no encontrado."});
            } 

            const productExists = cart.products.find(product => product.product === pid)
            
            if (productExists) {
                productExists.quantity += 1 || 1; 

            } else {
                cart.products.push({product: pid, quantity: 1});
            }
        
            await cartsService.saveCart();
            res.status(200).send({status: "success", message: "Producto agregado al carrito"});

        } catch (error) {
            console.error("Error en la ruta POST /carts/:cid/products/:pid", error);
            res.status(500).send({status: "error", message: "Error del servido al agregar producto al carrito"})
        }
        
    });



export default cartsRouter;