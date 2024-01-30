import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = "CoderSecretJWToken";

// generar token
const createToken = user => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: '1d'})

// verificar token
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    if(!authHeader) res.status(401).json({status: 'error', error: 'not authenticated'})

    const token = authHeader.split(' ')[1]  // separar por espacio, split devuelve array pos. 0 el bearer, pos 1 el token: ['Bearer', 'hghfghfhh']
    jwt.verify(token, JWT_PRIVATE_KEY, (err, userDecode)=>{
        if(err) return res.status(401).json({status: 'error', error: 'not authorized'})
        console.log('userDecode: ', userDecode)
        req.user = userDecode;
        next()
    })
}


export { createToken, authenticationToken, JWT_PRIVATE_KEY };