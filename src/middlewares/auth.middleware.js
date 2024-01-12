


import { UserService } from "../daos/mongo/userDaoMongo.js";

export const determineUserRole = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Usuario y/o contraseña incompletos");
        return res.status(401).send({ status: "Error", message: "Complete los campos de usuario y contraseña" });
    }

    try {
        let userLogged = null;

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            userLogged = {
                email: "adminCoder@coder.com",
                role: "admin",
                first_name: "Admin",
            };
        } else {
            const userService = new UserService();
            userLogged = await userService.login(email, password);

            if (!userLogged) {
                console.log("Usuario no encontrado en la base de datos");
                return res.status(401).send({ status: "Error", message: "No se encontró el usuario; email o contraseña incorrectos" });
            }
        }

        req.userRole = userLogged.role;
        next();
        
    } catch (error) {
        console.log("Error en el middleware de autenticación", error);
        return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
};
