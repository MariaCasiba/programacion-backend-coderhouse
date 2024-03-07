import EErrors from "../../services/errors/enums.js";

export const handleError = (err, req, res, next) => {
    
    switch (err.code) {
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send({status: "error", error: err.message})
            break;
        case EErrors.DATABASE_ERROR:
            return res.status(500).send({ status: "error", error: err.message });
            break;
        case EErrors.RESOURCE_NOT_FOUND_ERROR:
            return res.status(404).send({ status: "error", error: err.message }); 
        case EErrors.INVALID_CREDENTIALS_ERROR: 
            return res.status(401).send({ status: "error", error: err.message });
            break;
        default:
            return res.status(500).send({status: "error", error: "error server"})
            break;
    }

}
