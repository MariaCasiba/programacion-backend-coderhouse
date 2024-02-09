import passport from "passport";
//import GitHubStrategy from "passport-github2";
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




/*
// session con GITHUB 
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
*/

export default initializePassport;