import { userModel } from "./models/user.model.js";

export class UserService {

    constructor() {
        this.userModel = userModel
    }

    // Agregar usuario
    async addUser(user) {
        try {
            const repeatedUser = await userModel.findOne({ email: user.email });
            if (repeatedUser) {
                console.log("El email ya se encuentra registrado.");
                return false;
            }

            await userModel.create(user);
            console.log("Usuario agregado correctamente!");
            return true;

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

    // login 
    async login(email, password) {
        try {
            let user = null;

            if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
                user = {
                    email: "adminCoder@coder.com",
                    role: "admin",
                    first_name: "Admin",
                };
            } else {
                user = await this.userModel.findOne({ email });

                if (!user || user.password !== password) {
                    console.log("Usuario no encontrado o contraseña incorrecta");
                    return null;
                }
            }

            console.log("Usuario logueado:", user);
            return user;

        } catch (error) {
            console.error("Error al loguear el usuario:", error);
            return null;
        }
    }
}

