import { Router } from "express";

const loggerRouter = Router();

loggerRouter.get("/", (req, res) => {
    try {
        req.logger.fatal("Mensaje de Error Fatal");
        req.logger.error("Mensaje de Error")
        req.logger.warning("Mensaje de Warning");
        req.logger.info("Mensaje de Info");
        req.logger.http("Mensaje de http");
        req.logger.debug("Mensaje de Debug");
    
        res.status(200).send("Logs registrados correctamente");    
    } catch (error) {
        req.logger.error("Error en el registro de logs", error)
        res.status(500).send("Error en el registro de logs")
    }
    });

export default loggerRouter;