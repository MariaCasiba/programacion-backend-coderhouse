import express from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../../utils/hashPassword.js";
import { createToken } from "../../utils/jwt.js";
import { UserService } from "../../daos/mongo/usersDaoMongo.js";
import initializePassport from "../../config/passport.config.js";
import jwt from "jsonwebtoken";
import { passportCall } from "../../utils/passportCall.js"
import { authorizationJwt } from "../../passport-jwt/jwtPassport.middleware.js";

const router = express.Router();
initializePassport();

const userService = new UserService();




// JWT
// login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: "Error",
            message: "Complete los campos de usuario y contraseña",
        });
    }

    try {
        const user = await userService.login({ email, password });

        if (user && user.error) {
            return res.status(401).send({
                status: "Error",
                message: user.error,
            });
        }

        if (!user) {
            return res.status(401).send({
                status: "Error",
                message: "No se encontró el usuario. Email o contraseña incorrectos."
            })
        }

        const token = createToken({
            first_name: user.first_name, 
            last_name: user.last_name, 
            id:user._id, 
            role:user.role, 
            cartId: user.cartId
        });

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24, 
            httpOnly: true,
        }).send({
        status: "success",
        message: 'user loggued in',
        token: token,
        });

    } catch (error) {
        console.error("Error en el inicio de sesión", error);

        res.status(500).send({
            status: "Error",
            message: "Error interno del servidor",
        });
    }
});


// registro del usuario (jwt)
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !email || !password) {
        return res
        .status(400)
        .send({ status: "Error", message: "Complete los campos obligatorios" });
    }

    const userFound = await userService.getUserByMail(email);

    if (userFound) {
        return res.send({
        status: "Error",
        error: "Ya existe un usuario registrado con el email proporcionado",
        });
    }

    try {

        
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            
        };

        const userRegistered = await userService.addUser(newUser);
    
        if (userRegistered) {
            const token = createToken({
                first_name: userRegistered.first_name,
                last_name: userRegistered.last_name, 
                id:userRegistered._id, 
                age: userRegistered.age, 
                role:userRegistered.role, 
                cartId: userRegistered.cartId
            })

            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
            }).send({
                status: "success",
                message: 'user registered',
                token: token,
            });
        } else {
            res
            .status(401)
            .send({ status: "error", message: "No se pudo registrar el usuario!" });
        }

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send({
            status: "error",
            message: "Error interno del servidor al registrar el usuario",
        })
    }
    
});

// products
router.get("/products", passportCall('jwt'), (req, res) => {
    if (req.user) {
        const user = req.user;
        console.log("Usuario en /products: ", user);
        res.render("products", { user });
    } else {
        res.redirect("/login");
    }
});

// logout usuario

router.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect("/login");
    
});

// current para pruebas
router.get("/current", [passportCall('jwt'), authorizationJwt(['ADMIN'])], (req, res) => {
    res.send({message:"Datos sensibles", reqUser: req.user});
});


/*
// PASSPORT GITHUB
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products")
    } 
); 
*/

// crear, obtener, borrar cookies
/*
    router.get('/setcookies', (req, res) => {
        res.cookie('coderCookie', 'Esta es mi cookie', {maxAge: 100000000*24}).send('cookies')
    });
    // cookie firmada
    router.get('/setcookies', (req, res) => {
        res.cookie('signedCookie', 'Esta es mi cookie', {maxAge: 100000000*24, signed:true}).send('cookies')
    });
    router.get('/getcookies', (req, res) => {
       //console.log(req.cookies)
        console.log(req.signedCookies);
        res.send(req.signedCookies);
    });
    router.get('/deletecookies', (req, res) => {
        res.clearCookie('signedCookie').send('deleted cookie');     
    }) */



export default router;
