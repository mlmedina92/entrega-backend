import logger from '../winston.js'

// clase q customiza los errores 
export default class CustomError {
    static createCustomError({ name = 'Error', cause, messsage }) {//metodo q crea un nuevo error
        const newError = new Error(messsage, { cause })
        newError.name = name
        logger.error('Error: ' + messsage + ' - Cause: ' + cause)
        throw newError//lanza el error
    }
}