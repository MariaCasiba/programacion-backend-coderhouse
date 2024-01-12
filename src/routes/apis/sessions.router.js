import express from "express";
import { UserService } from "../../daos/mongo/userDaoMongo.js";
import { determineUserRole}  from "../../middlewares/auth.middleware.js";

const router = express.Router();

const userService = new UserService();


// login del usuario
router.post('/login', determineUserRole, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: "Error", message: "Complete los campos de usuario y contraseña" });
    }

    try {
        const user = await userService.login(email, password);

        if (user) {
            req.session.user = user;

            if (user.role === 'admin') {
                res.send({ status: "OK", message: "Inicio de sesión exitoso como administrador!" });
            } else if (user.role === 'user') {
                res.send({ status: "OK", message: "Inicio de sesión exitoso como usuario!" });
            } else {
                res.status(500).send({ status: "Error", message: "Error al determinar el rol del usuario" });
            }
        } else {
            res.status(401).send({ status: "Error", message: "Usuario no encontrado o contraseña incorrecta" });
        }
    } catch (error) {
        console.error("Error en el inicio de sesión", error);
        res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
});


// registro del usuario
router.post('/register', async (req, res)=> {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !email || !password) {
        return res.status(400).send({ status: "Error", message: "Complete los campos obligatorios" });
    }

    const user = { first_name, last_name, email, age, password };
    const userRegistered = await userService.addUser(user);

    if (userRegistered) {
        res.send({
            status: "success", 
            payload: {
                first_name: userRegistered.first_name,
                last_name: userRegistered.last_name,
                email: userRegistered.email,
                age: userRegistered.age,
                _id: userRegistered._id
            } 
        });
    } else {
        res.status(401).send({ status: "error", message: "No se pudo registrar el usuario!" });
    }
});



// products: 
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
            return res.status(401).send({status: 'error', message: "No autenticado"})
        }

        req.session.destroy((err) => {
            if (err) {
            console.error("Error al destruir la sesión", err);
            return res.status(500).send({ status: 'error', message: 'Error interno del servidor'});
            }

            console.log('Sesión destruida');
            res.redirect('/login')
        });
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