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


/*
// PASSPORT GITHUB
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products")
    } 
); 
*/

// crear, obtener, borrar cookies
/*
    router.get('/setcookies', (req, res) => {
        res.cookie('coderCookie', 'Esta es mi cookie', {maxAge: 100000000*24}).send('cookies')
    });
    // cookie firmada
    router.get('/setcookies', (req, res) => {
        res.cookie('signedCookie', 'Esta es mi cookie', {maxAge: 100000000*24, signed:true}).send('cookies')
    });
    router.get('/getcookies', (req, res) => {
       //console.log(req.cookies)
        console.log(req.signedCookies);
        res.send(req.signedCookies);
    });
    router.get('/deletecookies', (req, res) => {
        res.clearCookie('signedCookie').send('deleted cookie');     
    }) */



export default router;
