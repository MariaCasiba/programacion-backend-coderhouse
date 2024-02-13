import express from "express";
import initializePassport from "../../config/passport.config.js";
import { passportCall } from "../../utils/passportCall.js"
import { authorizationJwt } from "../../passport-jwt/jwtPassport.middleware.js";
import UserController from "../../controllers/users.controller.js";

const router = express.Router();
initializePassport();


const userController = new UserController()


// login
router.post("/login", userController.loginUser);

// registro del usuario (jwt)
router.post("/register", userController.registerUser);

// logout usuario
router.get("/logout", userController.logoutUser);

// current user
router.get("/current", [passportCall('jwt'), authorizationJwt(['ADMIN'])], userController.currentUser);




export default router;