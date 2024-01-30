import express from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../../utils/hashPassword.js";
import { createToken } from "../../utils/jwt.js";
import { UserService } from "../../daos/mongo/usersDaoMongo.js";
import initializePassport from "../../config/passport.config.js";
import jwt from "jsonwebtoken";
import { passportCall } from "../../utils/passportCall.js"
import { authorizationJwt } from "../../middlewares/jwtPassport.middleware.js";

const router = express.Router();
initializePassport();

const userService = new UserService();

/*
// PRIMERA ESTRATEGIA 
// login del usuario (primera estrategia)
router.post("/login", determineUserRole, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
        .status(400)
        .send({
            status: "Error",
            message: "Complete los campos de usuario y contraseña",
        });
    }

    try {
        const user = await userService.login(email, password);

        if (user) {
        const passwordValido = isValidPassword(password, user);

        if (passwordValido) {
            req.session.user = user;

            if (user.role === "admin") {
            res.send({
                status: "OK",
                message: "Inicio de sesión exitoso como administrador!",
            });
            } else if (user.role === "user") {
            res.send({
                status: "OK",
                message: "Inicio de sesión exitoso como usuario!",
            });
            } else {
            res
                .status(500)
                .send({
                status: "Error",
                message: "Error al determinar el rol del usuario",
                });
            }
        } else {
            res
            .status(401)
            .send({ status: "Error", message: "Contraseña incorrecta" });
        }
        } else {
        res
            .status(401)
            .send({
            status: "Error",
            message: "Usuario no encontrado o contraseña incorrecta",
            });
        }
    } catch (error) {
        console.error("Error en el inicio de sesión", error);
        res
        .status(500)
        .send({ status: "Error", message: "Error interno del servidor" });
    }
});


// registro del usuario (primera estrategia)
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !email || !password) {
        return res
        .status(400)
        .send({ status: "Error", message: "Complete los campos obligatorios" });
    }

    const userFound = await userService.getUserByMail({ email });

    if (userFound) {
        return res.send({
        status: "Error",
        error: "Ya existe un usuario registrado con el email proporcionado",
        });
    }

    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    };
    const userRegistered = await userService.addUser(newUser);

    if (userRegistered) {
        res.send({
        status: "success",
        payload: {
            first_name: userRegistered.first_name,
            last_name: userRegistered.last_name,
            email: userRegistered.email,
            age: userRegistered.age,
            _id: userRegistered._id,
        },
        });
    } else {
        res
        .status(401)
        .send({ status: "error", message: "No se pudo registrar el usuario!" });
    }
}); 


// PASSPORT LOCAL
// register con passport local
router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
    console.log("Registro exitoso");
    res.send({status:"success", message: "Usuario registrado con éxito!"});
});
    
// fail register
router.get('/failregister', async (req, res) => {
    console.log("Falló el registro del usuario")
    res.send({status: "error", error: "Register failed"})
})


// login con passport local
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res) => {
    console.log("llegó una solicitud a /api/sessions/login")
    if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentials'})

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
}
    res.status(200).send({status: 'success', redirect:'/products'});
})


// fail login
router.get('/faillogin', (req, res) => {
    res.send({error: 'Failed login'})
})
*/


// JWT 
// login con jwt
/*
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

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        };

        const token = createToken({ id: user._id, role: user.role });
        res.json({
            status: "success",
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            },
            token,
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

    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    };
    const userRegistered = await userService.addUser(newUser);

    if (userRegistered) {
        const token = createToken({id:userRegistered._id, role:userRegistered.role})
        res.send({
        status: "success",
        payload: {
            first_name: userRegistered.first_name,
            last_name: userRegistered.last_name,
            email: userRegistered.email,
            age: userRegistered.age,
            _id: userRegistered._id,
        },
        token 
        });
    } else {
        res
        .status(401)
        .send({ status: "error", message: "No se pudo registrar el usuario!" });
    }
});
*/


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

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            cartId: user.cartId || null 
        };

        const token = createToken({
            first_name: user.first_name, 
            last_name: user.last_name, 
            id:user._id, 
            role:user.role, 
            cartId: user.cartId
        });

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24
        }).json({
        status: "success",
        message: 'loggued in',
        httpOnly: true,
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
            }).json({
                status: "success",
                message: 'loggued in'
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


// PASSPORT GITHUB
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products")
    } 
); 


// products
router.get("/products", (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        console.log("Usuario en /products: ", user);
        res.render("products", { user });
    } else {
        res.redirect("/login");
    }
});

// logout usuario

router.get("/logout", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ status: "error", message: "No autenticado" });
    }

    req.session.destroy((err) => {
        if (err) {
        console.error("Error al destruir la sesión", err);
        return res
            .status(500)
            .send({ status: "error", message: "Error interno del servidor" });
        }

        console.log("Sesión destruida");
        res.redirect("/login");
    });
});

// current para pruebas
router.get("/current", passportCall('jwt'), authorizationJwt('user'), (req, res) => {
    res.send({message:"Datos sensibles", reqUser: req.user});
});


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
