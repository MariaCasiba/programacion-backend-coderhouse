import { Router } from "express";
//import { ProductManager } from "../daos/file/ProductManagerFs.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";
import { CartService } from "../daos/mongo/cartsDaoMongo.js";
import { passportCall } from "../utils/passportCall.js";


const router = Router();

const productService = new ProductService(); 
const cartService = new CartService();

// vista de handlebars  home
router.get("/", async (req, res) => {
    res.render("home")
    if (req.user) {
      res.redirect("/products");
  } else {
      res.redirect("/login");
  }
});

//vista de handlebars para products
router.get("/products", passportCall('jwt'), async (req, res) => {
  try {
    let products = await productService.getProducts(req.query);
    const user = req && req.user;
    console.log('Datos del usuario en sesión: ', user)
    res.render("products", { products, user } );

  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
  
});

//vista de handlebars para product
router.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  let product = await productService.getProductById(productId);
  res.render("product", { product })
});

//vista de handlebars para carrito
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  let cart = await cartService.getCartById(cartId);
  res.render("cart", { cart })
})

// vista de handlebars de productos en tiempo real 
router.get("/realtimeproducts", async (req, res) => {
  try {
    let realTimeProducts = await productService.getProducts();
    res.render("realTimeProducts", { realTimeProducts: realTimeProducts });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});


// vista de handlebars para el chat 
router.get("/chat", (req, res) => {
  res.render("chat");
})

//vista de handlebars para el login de usuario
router.get("/login", async (req, res) => {
  res.render("login");
})

//vista de handlebars para registro de usuario
router.get("/register", async (req, res) => {
  res.render("register");
})

//vista de handlebars para profile de usuario
router.get("/profile", (req, res) => {
  if (req.user) {
    const user = req.user;
    console.log("datos de usuario en /profile: ", user)
    res.render("profile", { user })
  } else {
  res.redirect("/login");
  }
})


/*
// vista de handlebars de productos con fs
router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    res.render("home", {
      title: "Productos",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error interno del server");
  }
});

// vista de handlebars de productos en tiempo real con fs 
router.get("/realtimeproducts", async (req, res) => {
  try {
    let realTimeProducts = await productManager.getProducts();
    res.render("realTimeProducts", { realTimeProducts: realTimeProducts });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});


router.post("/products", (req, res) => {
    const newProduct = productManager.addProduct(req.body);
    req.app.get("socketServer").emit("product_created", newProduct);
    res.json(newProduct);
    });
    
router.delete("/products/:id", (req, res) => {
    let id = Number(req.params.id);
    const deletedProduct = productManager.deleteProduct(id);
    res.send({
    status: "ok",
    message: "El Producto se eliminó correctamente!",
    });
    req.app.get("socketServer").emit("product_deleted", deletedProduct);
    res.json(deletedProduct);
    
    });
*/

export default router;
