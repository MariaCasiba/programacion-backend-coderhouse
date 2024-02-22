// para validar rol rutas protegidas

export const authorizationJwt = roleArray => {
    return async (req, res, next) => {
        try {
            if(!req.user) return res.status(401).send({error: 'Unauthorized'})

            if(!roleArray.includes(req.user.role.toUpperCase())) return res.status(403).send({status: "error", message: 'Not permissions'})
            next()
        } catch (error) {
            next(error)
        }
        
    }
} 