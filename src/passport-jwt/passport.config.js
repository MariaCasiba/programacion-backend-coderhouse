import passport from "passport";
import  passport_jwt  from "passport-jwt";
import { configObject } from "../config";


// PASSPORT JWT 
const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt;



const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null

        if (req && req.cookies) {
            token = req.cookies['token']
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_private_key
    }, async ( jwt_payload, done )=>{
        try {
            console.log("jwt_payload de passport config: ", jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
        
    }))
}


export default initializePassport;