
import { userModel } from "./models/user.model.js";
import { CartService } from "./cartsDaoMongo.js";

export class UserService {
    constructor() {
        this.userModel = userModel;
        this.cartService = new CartService();
    }

    // agregar usuario
    addUser = async (user) => {
        try {
            const cartId = await this.cartService.createCart();
            user.cartId = cartId;

            const newUser = await this.userModel.create(user);

            return newUser;
        } catch (error) {
            console.error("Error al agregar el usuario!", error);
            return null;
        }
    }

    // obtener usuarios
    getUsers = async () => {
        return await this.userModel.find({});
    }

    // obtener usuario por id
    getUserById = async (uid) => {
        return await this.userModel.findOne({ _id: uid });
    }

    // obtener usuario por email
    getUserByMail = async (uemail) => {
        return await this.userModel.findOne({ email: uemail });
    }

    // actualizar usuario
    updateUser = async (uid, userUpdate) => {
        return await this.userModel.findOneAndUpdate({ _id: uid }, userUpdate);
    }

    // borrar usuario
    deleteUser = async (uid) => {
        return await this.userModel.findOneAndDelete({ _id: uid });
    }

    // login usuario
    login = async (credentials) => {
        try {
            
            const { email, password } = credentials;
            const user = await this.userModel.findOne({ email });

            if (!user && !user.isValidPassword(password)) {
                return null;
            } 
            return user;

        } catch (error) {
            console.error("Error en la autenticación:", error);
            return null;
        }
    }
}

export default UserService;
