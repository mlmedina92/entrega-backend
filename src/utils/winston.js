import winston from 'winston' // Documentación https://github.com/winstonjs/winston
import config from '../config.js'

// const logger = winston.createLogger({
//     //level : si no le paso level, sirve para todos los niveles 
//     //transports: te dice dond queres generar el log si en consola o en archivos
//     transports: [ //transporte 1 q muetsra por consola lo q este del nivel hhtp para arriba 
//         new winston.transports.Console({ //lo muetra por consola
//             level: 'http', //este transporte solo quiero q se ejecute para el nivel http y los que esten arriba 
//             //         level:'silly',
//             format: winston.format.combine(
//                 winston.format.colorize(),// no los da en consola pero con colores predefinidos para c/nivel 
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({//lo muetra por archivos a alos errores los gurado ahi //transporte 2 q giarda en archivos  lo q este del nivel error para arriba 
//             filename: '../logs/errors.log',
//             level: 'error',
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.prettyPrint()
//             )
//         })
//     ]
// })

let logger

//levels y colores personalizados
const customLevels = {
    names: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'green',
        debug: 'blue',
    }
}

if (config.node_env === 'development') {
    logger = winston.createLogger({
        levels: customLevels.names,
        transports: [
            //transporte q muetsra por consola lo q este del nivel debug para arriba 
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple()
                )
            }),
        ]

    })
} else { // node_env === 'production'
    logger = winston.createLogger({
        levels: customLevels.names,
        transports: [
            //muetsra por consola lo q este del nivel info para arriba 
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize({ colors: customLevels.colors }),// los da en consola pero con colores predefinidos para c/nivel 
                    winston.format.simple()
                )
            }),
            //guarda los errores en errors.log
            new winston.transports.File({
                filename: '../logs/errors.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    })
}


export default logger