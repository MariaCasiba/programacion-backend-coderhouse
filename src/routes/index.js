import express from 'express';
import productsRouter from './apis/products.router.js';
import cartsRouter from './apis/carts.router.js';
import sessionsRouter from './apis/sessions.router.js';
import viewsRouter from './views.router.js';
import emailRouter from './apis/email.router.js';
import smsRouter from './apis/sms.router.js';
import mockRouter from './apis/mocks.router.js';
import pruebasRouter from './apis/pruebas.js';
import loggerRouter from './apis/logger.router.js';
import { swaggerUiExpress, specs } from '../config/swagger.js';


const router = express.Router();

// rutas para manejo de productos
router.use('/api/products', productsRouter);

// rutas para manejo de carritos
router.use('/api/carts', cartsRouter);

//rutas para vistas de handlebars
router.use('/', viewsRouter);

// rutas para vistas de sesiones
router.use('/api/sessions/', sessionsRouter);

// rutas para pruebas de email y sms
router.use('/api/email', emailRouter);
router.use('/api/sms', smsRouter)

// ruta para mocking
router.use('/', mockRouter);

// ruta para logger
router.use("/loggerTest", loggerRouter)

// Rutas para Swagger
router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// pruebas
router.use('/', pruebasRouter )

// comodín
router.use('*', (req, res) => {
    res.status(404).send('not found')
})



export default router;