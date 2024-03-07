import winston from "winston";
import { configObject } from "../config/index.js"

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "yellow",
        info: "blue",
        http: "blue",
        debug: "white",
    },
};

const consoleLogLevel = configObject.mode === "development" ? "debug" : "info";


export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: consoleLogLevel,
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

// middleware para mostrar por consola los logs de consultas http
export const addLogger = (req, res, next) => {
    req.logger = logger;

    // loguea desde debug en modo desarrollo
    if (configObject.mode === "development") {
        req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    }

    next();
};


