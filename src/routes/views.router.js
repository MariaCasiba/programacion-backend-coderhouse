import { Router } from "express";
//import { ProductManager } from "../daos/file/ProductManagerFs.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";
import { CartService } from "../daos/mongo/cartsDaoMongo.js";
import { passportCall } from "../utils/passportCall.js";


const router = Router();

const productService = new ProductService(); 
const cartService = new CartService();

//  home 

router.get("/", async (req, res) => {

  if (req.user) {
    res.redirect("/products");
  } else {
    res.redirect("/login");
  }
});

// products
router.get("/products", passportCall('jwt'), async (req, res) => {
  try {
    console.log('Parámetros de paginación recibidos en el enrutador de vistas:', req.query);
    
    let products = await productService.getProducts(req.query);
    const user = req && req.user;
    console.log('Datos del usuario en sesión: ', user)
    res.render("products", { products, user } );

  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
  
});

// product
router.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  let product = await productService.getProductById(productId);
  res.render("product", { product })
});

// carrito
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  let cart = await cartService.getCartById(cartId);
  res.render("cart", { cart })
})

//  productos en tiempo real 
router.get("/realtimeproducts", async (req, res) => {
  try {
    let realTimeProducts = await productService.getProducts();
    res.render("realTimeProducts", { realTimeProducts: realTimeProducts });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});


// chat 
router.get("/chat", (req, res) => {
  res.render("chat");
})

// login de usuario
router.get("/login", async (req, res) => {
  res.render("login");
})

// registro de usuario
router.get("/register", async (req, res) => {
  res.render("register");
})

// profile de usuario
router.get("/profile", passportCall('jwt'), (req, res) => {
  if (req.user) {
    const user = req.user;
    console.log("datos de usuario en /profile: ", user)
    res.render("profile", { user })
  } else {
  res.redirect("/login");
  }
})




export default router;