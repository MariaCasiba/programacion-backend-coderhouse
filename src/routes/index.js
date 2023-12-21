import express from 'express';
import productsRouter from './apis/products.router.js';
import cartsRouter from './apis/carts.router.js';
import viewsRouter from './views.router.js';

const router = express.Router();


// rutas para manejo de productos
router.use('/api/products', productsRouter);

// rutas para manejo de carritos
router.use('/api/carts', cartsRouter);

//rutas para vistas de handlebars
router.use('/', viewsRouter);



export default router;