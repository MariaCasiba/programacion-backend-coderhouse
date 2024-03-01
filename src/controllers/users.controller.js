import { createToken } from "../utils/jwt.js";
import { configObject } from "../config/index.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { userService } from "../repositories/service.js";
import CustomError from "../services/errors/CustomError.js";
import generateUserErrorInfo from "../services/errors/generateUserErrorInfo.js";
import generateAuthenticationErrorInfo from "../services/errors/generateAuthenticationErrorInfo.js"
import EErrors from "../services/errors/enums.js";

class UserController {
    constructor() {
        this.userService = userService;
    }
    
    // login del usuario
    
    loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                const error = CustomError.createError({
                    name: 'User login error',
                    cause: generateAuthenticationErrorInfo({ email, password }),
                    message: 'Error trying login user',
                    code: EErrors.INVALID_TYPES_ERROR
                })
                throw error;

            }
        
            let user = null; 
    
            if (email === configObject.admin_email && password === configObject.admin_password) {
                user = {
                    email: configObject.admin_email,
                    role: "admin",
                    first_name: "Admin"
                }
            } else {

                user = await this.userService.getUserByMail(email)
                console.log("user en controller: ", user)
    
                if (!user) {
                    return res.status(401).send({
                        status: "Error",
                        message: "Email incorrectos",
                    });
                }

                if (user && !isValidPassword(password, user)) {

                    return res.status(401).send({
                        status: "Error",
                        message: "Contraseña incorrecta",
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
            next(error)
            }
    }
    


    // registro de usuario
    registerUser = async (req, res, next) => {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            console.log("Datos del usuario a registrar:", { first_name, last_name, email, age, password });

            if (!first_name || !email || !password) {
                const error = CustomError.createError({
                    name: 'User registration error',
                    cause: generateUserErrorInfo({first_name, last_name, email}),
                    message: 'Error trying register user',
                    code: EErrors.INVALID_TYPES_ERROR
                })
                throw error;
                
            }

            const userFound = await this.userService.getUserByMail(email);
            
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
            
            const userRegistered = await this.userService.registerUser(newUser);

            console.log("userRegistered en el controller: " , userRegistered)
            
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
            next(error)     
        }
    }

    // logout usuario
    logoutUser = async (req, res) => {
        try {
            res.clearCookie('token');
            res.redirect("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).send({
                status: "Error",
                message: "Error interno del servidor al cerrar sesión",
            });
        }
    }


    // current user 
    getCurrentUser = async (req, res) => {
        try {
            const userDto = await this.userService.getCurrentUser(req);
            res.send({ user: userDto}) 

        } catch (error) {
            console.error("Error al obtener el usuario actual: ", error);
            res.status(500).send({
                status: "Error",
                message: "Error interno del servidor al obtener el usuario actual"
            })
        }
    }


}

export default UserController