import jwt from "jsonwebtoken";
import { configObject } from "../config/index.js";


// generar token
const createToken = (user, expiresIn ) => jwt.sign(user, configObject.jwt_private_key, {expiresIn})


const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next({ status: 401, message: 'not authenticated' });

    const token = authHeader.split(' ')[1];   
    jwt.verify(token, configObject.jwt_private_key, (err, userDecode) => {
        if (err) return next({ status: 401, message: 'not authorized' });
        
        req.user = userDecode;
        next(null, userDecode); 
    });
};


export { createToken, authenticationToken };