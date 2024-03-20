import UserService from "../daos/mongo/usersDaoMongo.js";
import UserDto from "../dtos/usersDto.js";
import { logger } from "../utils/logger.js";

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
            throw error;
        }
    }

    // registro de usuario
    registerUser = async (newUser) => {
        try {
            const userRegistered = await this.userService.addUser(newUser);
            return userRegistered;

        } catch (error) {
            throw error;
        }
    }

    // obtener usuario por email
    getUserByMail = async (email) => {
        try {
            const user = await this.userService.getUserByMail(email);
            return user;
        } catch (error) {
            logger.error("Error al obtener usuario por email:", error);
            throw error;
        }
    }

    getUserById = async (id) => {
        try {
            const user = await this.userService.getUserById(id);
            return user;
        } catch (error) {
            logger.error("Error al obtener usuario por id:", error);
            throw error;
        }
    }

    // obtener el usuario actual
    getCurrentUser = async (req) => {
        try {
            const userData = req.user;
            return new UserDto(userData);

        } catch (error) {
            logger.error("Error al obtener el usuario actual:", error);
            throw error;
        }
    }

}

export default UserRepository