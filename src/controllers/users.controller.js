import { UserService } from "../daos/mongo/usersDaoMongo.js";
import { createToken } from "../utils/jwt.js";
import { configObject } from "../config/index.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js"


class UserController {
    constructor() {
        this.userService = new UserService()
    }
    
    // login del usuario

    loginUser = async (req, res) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).send({
                status: "Error",
                message: "Complete los campos de usuario y contraseña",
            });
        }
    
        try {
            let user = null; 
    
            if (email === configObject.admin_email && password === configObject.admin_password) {
                user = {
                    email: configObject.admin_email,
                    role: "admin",
                    first_name: "Admin"
                }
            } else {
                user = await this.userService.getUserByMail(email);
                console.log("User: ", user)
    
                if (!user) {
                    return res.status(401).send({
                        status: "Error",
                        message: "Email o contraseña incorrectos",
                    });
                }
    
                if (!isValidPassword(password, user)) {
                    return res.status(401).send({
                        status: "Error",
                        message: "Email o contraseña incorrectos",
                    });
                }
            }
    
            const token = createToken({
                first_name: user.first_name, 
                last_name: user.last_name, 
                id: user._id, 
                email: user.email,
                age: user.age,
                role: user.role, 
                cartId: user.cartId
            });
    
            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24, 
                httpOnly: true,
            }).send({
                status: "success",
                message: 'Inicio de sesión exitoso',
                token: token,
            });
    
        } catch (error) {
            console.error("Error en el inicio de sesión", error);
    
            res.status(500).send({
                status: "Error",
                message: "Error interno del servidor",
            });
        }
    }
    

    // registro de usuario
    registerUser = async (req, res) => {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !email || !password) {
            return res.status(400).send({
                status: "Error",
                message: "Complete los campos obligatorios",
            });
        }

        const userFound = await this.userService.getUserByMail(email);

        if (userFound) {
            return res.send({
                status: "Error",
                error: "Ya existe un usuario registrado con el email proporcionado",
            });
        }

        try {
            // Crear un nuevo usuario con el servicio
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
            };

            
            const userRegistered = await this.userService.addUser(newUser);

            if (userRegistered) {
            
                const token = createToken({
                    first_name: userRegistered.first_name,
                    last_name: userRegistered.last_name,
                    id: userRegistered._id,
                    email: userRegistered.email,
                    age: userRegistered.age,
                    role: userRegistered.role,
                    cartId: userRegistered.cartId,
                });
            
                res.cookie('token', token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                }).send({
                    status: "success",
                    message: 'user registered',
                    token: token,
                });
            } else {
            
                res.status(401).send({ status: "error", message: "No se pudo registrar el usuario!" });
            }
        } catch (error) {
            
            console.error("Error al registrar usuario:", error);
            res.status(500).send({
                status: "error",
                message: "Error interno del servidor al registrar el usuario",
            });
        }
    }

    // logout usuario
    logoutUser = async (req, res) => {
        res.clearCookie('token');
        res.redirect("/login");
    }

    // current user
    currentUser = async (req, res) => {
        res.send({message:"Datos sensibles", reqUser: req.user});
    }


}

export default UserController