import { Router } from "express";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";
import { CartService } from "../daos/mongo/cartsDaoMongo.js";
import { passportCall } from "../utils/passportCall.js";
import { authorizationJwt } from "../passport-jwt/jwtPassport.middleware.js";


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
    const { limit = 10, page = 1, query = {}, sort } = req.query;
    let products = await productService.getProducts({ limit, page, query, sort });
    const user = req && req.user;
    res.render("products", { products, user});
    
  } catch (error) {
    req.logger.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
  
}); 

// product
router.get("/products/:pid", passportCall('jwt'),  async (req, res) => {
  const productId = req.params.pid;
  let product = await productService.getProductById(productId);
  res.render("product", { product })
});

// carrito
router.get("/carts/:cid", passportCall('jwt'), authorizationJwt(["USER"]), async (req, res) => {
  const cartId = req.params.cid;
  let cart = await cartService.getCartById(cartId);
  res.render("cart", { cart })
})

//  productos en tiempo real 
router.get("/realtimeproducts", passportCall('jwt'), authorizationJwt(["ADMIN"]), async (req, res) => {
  try {
    const {limit = 500, page= 1, query = {}, sort} = req.query;
    let realTimeProducts = await productService.getProducts({limit, page, query, sort});
    res.render("realTimeProducts", { realTimeProducts });
  } catch (error) {
    req.logger.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});

// chat 
router.get("/chat", passportCall('jwt'), authorizationJwt(["USER"]), (req, res) => {
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
    req.logger.info("datos de usuario en /profile: ", user)
    res.render("profile", { user })
  } else {
  res.redirect("/login");
  }
})


export default router;
