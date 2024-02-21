import UserService from "../daos/mongo/usersDaoMongo.js";
import { createHash } from "../utils/hashPassword.js";
import UserDto from "../dtos/usersDto.js";

class UserRepository {
    constructor() {
        this.userService = new UserService()
    }

    // login de usuario 
    loginUser = async (email, password) => {
        try {
            const user = await this.userService.getUserByMail(email);
            return user;
        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            throw error;
        }
    }

    // registro de usuario
    registerUser = async (newUser) => {
        try {
            newUser.password = createHash(newUser.password);
            const userRegistered = await this.userService.addUser(newUser);
            return userRegistered;

        } catch (error) {
            console.error("Error al intentar registrar usuario:", error);
            throw error;
        }
    }

    // obtener usuario por email
    getUserByMail = async (email) => {
        try {
            console.log("Buscando usuario con el email: ", email);
            const user = await this.userService.getUserByMail(email);
            console.log("Usuario encontrado: ", user);
            return user;
        } catch (error) {
            console.error("Error al obtener usuario por email:", error);
            throw error;
        }
    }

    // obtener el usuario actual
    getCurrentUser = async (req) => {
        try {
            const userData = req.user;
            return new UserDto(userData);

        } catch (error) {
            console.error("Error al obtener el usuario actual:", error);
            throw error;
        }
    }

}

export default UserRepository