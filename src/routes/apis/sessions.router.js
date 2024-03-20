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
router.get("/current", passportCall('jwt'), authorizationJwt(["USER"]), userController.getCurrentUser);

// restore password 
router.post("/restore-password", userController.restorePassword);

// reset password 
router.post("/reset-password/:token", userController.resetPassword);



export default router;