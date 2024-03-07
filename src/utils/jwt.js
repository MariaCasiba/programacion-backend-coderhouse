import jwt from "jsonwebtoken";
import { configObject } from "../config/index.js";



// generar token
const createToken = user => jwt.sign(user, configObject.jwt_private_key, {expiresIn: '24h'})

// verificar token
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(!authHeader) res.status(401).json({status: 'error', error: 'not authenticated'})

    const token = authHeader.split(' ')[1]   
    jwt.verify(token, configObject.jwt_private_key, (err, userDecode)=>{
        if(err) return res.status(401).json({status: 'error', error: 'not authorized'})
        req.user = userDecode;
        next()
    })
}


export { createToken, authenticationToken };