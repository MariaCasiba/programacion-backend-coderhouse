import { createHash, isValidPassword } from "../../utils/hashPassword.js";
import { userModel } from "./models/user.model.js";
import { CartService } from "./cartsDaoMongo.js";

export class UserService {

    constructor() {
        this.userModel = userModel;
        this.cartService = new CartService();
    }


    // Agregar usuario
    async addUser(user) {
        try {
            const repeatedUser = await this.userModel.findOne({ email: user.email });
            if (repeatedUser) {
                console.log("El email ya se encuentra registrado.");
                return false;
            }

            const cartId = await this.cartService.createCart();
            console.log("Nuevo carrito creado en addUser: ", cartId);

            user.cartId = cartId;

            console.log("Usuario antes de guardarlo", user);
            const newUser = await this.userModel.create(user);

            console.log("Usuario agregado correctamente!");
            return newUser;

        } catch (error) {
            console.log("Error al agregar el usuario!", error);
            return false;
        }
    }



    // Obtener todos los usuarios
    async getUsers() {
        try {
            return await this.userModel.find({});
            
        } catch (error) {
            console.log("Error al obtener todos los usuarios:", error);
            return false;
        }
    }

    // Obtener usuario por ID
    async getUserById(uid) {
        try {
            return await this.userModel.findOne({ _id: uid });

        } catch (error) {
            console.log("Error al obtener el usuario por el Id", error);
            return false;
        }
    }

    // Obtener usuario por email
    async getUserByMail(uemail) {
        try {
            return await this.userModel.findOne({ email: uemail });

        } catch (error) {
            console.log("Error al obtener el usuario por email", error);
            return false;
        }
    }


    // Actualizar usuario
    async updateUser(uid, userUpdate) {
        try {
            return await this.userModel.findOneAndUpdate({ _id: uid }, userUpdate);

        } catch (error) {
            console.log("Error al actualizar el usuario", error);
            return false;
        }
    }

    // Eliminar usuario
    async deleteUser(uid) {
        try {
            return await this.userModel.findOneAndDelete({ _id: uid });

        } catch (error) {
            console.log("Error al eliminar el usuario", error);
            return false;
        }
    }



async login(credentials) {
    try {
        let user = null;

        if (credentials.email === "adminCoder@coder.com" && credentials.password === "adminCod3r123") {
            user = {
                email: "adminCoder@coder.com",
                role: "admin",
                first_name: "Admin",
                password: createHash("adminCod3r123"),
            };
        } else {
            user = await this.userModel.findOne({ email: credentials.email });

            if (!user) {
                console.log("Usuario no encontrado");
                return { error: "No se encontró el usuario" };
            }

            if (!isValidPassword(credentials.password, user)) {
                console.log("Contraseña incorrecta");
                return { error: "Contraseña incorrecta" };
            }
        }

        console.log("Usuario logueado:", user);
        return user;

    } catch (error) {
        console.error("Error al loguear el usuario:", error);
        return { error: "Error interno del servidor" };
    }
}

}

