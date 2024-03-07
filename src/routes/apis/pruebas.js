import { Router } from "express";

const pruebasRouter = new Router()

pruebasRouter.get("/logger", (req, res) => {
    req.logger.error('Alerta! esto es un error en el endpoint de pruebas')
    res.send("logger");

});

export default pruebasRouter