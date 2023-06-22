import mongoose from 'mongoose'
import config from "../../config.js"
import CustomError from '../../utils/errors/CustomError.js'
import { ErrorsName } from '../../utils/errors/errors.enum.js'
import logger from '../../utils/winston.js'

const URI = config.mongo_uri

try {
    await mongoose.connect(URI)
    logger.debug('conectado a la BD');

} catch (error) {
    CustomError.createCustomError({
      name: ErrorsName.CONECCTING_MONGO,
      cause: error.cause || error.stack,
      message: error.message,
    })
  }