import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import __dirname from '../utils/index.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de la app para ecommerce ',
            description: 'Api Docs para el ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/**.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)


export { swaggerUiExpress, specs };