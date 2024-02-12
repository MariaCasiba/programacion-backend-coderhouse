import passport from "passport";
import jwt from "passport-jwt";
import { UserService } from "../daos/mongo/usersDaoMongo.js";
import { configObject } from "./index.js";



// PASSPORT JWT 
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const userService = new UserService()


const initializePassport = () => {

    const cookieExtractor = req => {
        let token = null;
        if( req && req.cookies){
            token = req.cookies['token'] 
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_private_key,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}


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