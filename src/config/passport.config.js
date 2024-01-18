import passport from "passport";
import local from 'passport-local';
import mongoose from "mongoose";
import GitHubStrategy from "passport-github2";
//import { userModel } from "../daos/mongo/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { UserService } from "../daos/mongo/usersDaoMongo.js";

const LocalStrategy = local.Strategy;
const userService = new UserService();


const initializePassport = () => {

    // register
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const {first_name, last_name, email, age} = req.body;
        
            let userFound = await userService.getUserByMail(username)

            if (userFound) {
                console.log("El usuario " + email + " ya se encuentra registrado.");
                return done(null, false, { message: 'El email ya se encuentra registrado'});
            }
            let newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            }

            let result = await userService.addUser(newUser)

            if (result) {
                console.log("Usuario registrado con exito: ", result);
                return done(null, result);
            }

        } catch (error) {
            return done('Error al crear un usuario' + error)
        }
    }))
}


// login
passport.use("login", new LocalStrategy({ 
    usernameField: "email" 
}, async (username, password, done) => {
    try {
        let user;

        if (username === "adminCoder@coder.com" && password === "adminCod3r123") {

        const adminUserId = new mongoose.Types.ObjectId();
        
        user = {
            _id: adminUserId,
            first_name: "Admin",
            email: "adminCoder@coder.com", 
            role: "admin"
        };

        return done(null, user);

    } else {
        user = await userService.getUserByMail(username);

        if (!user) {
            console.log("Error! El usuario no existe!");
            return done(null, false);
        }

        if (!isValidPassword(password, {password: user.password})) {
            console.log("Contraseña incorrecta");
            return done(null, false);
        }

        console.log("Inicio de sesión exitoso. Usuario:", user.email);
        return done(null, user);
        }

    } catch (error) {
        console.log("Error en autenticación", error);
        return done(error);
    }
}));



passport.use("github", new GitHubStrategy(
    {
        clientID: "Iv1.2212fbba5c30fd64",
        clientSecret: "6c246af91da1c90fdf8607b858430df89bf39a40",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const userEmail = profile._json.email;
            let user = await userService.getUserByMail(userEmail);

            if (!user) {
                const userNew = {
                    first_name: profile.username,
                    email: userEmail,
                    password: "123456"
                }

                const result = await userService.addUser(userNew);
                return done(null, result);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));




//serialize y deserialize (guardar y recuperar credenciales del usuario de session)

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


export default initializePassport;