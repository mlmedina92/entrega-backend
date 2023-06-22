import { tktsModel } from "../../mongo/models/tickets.model.js"
import CustomError from '../../../utils/errors/CustomError.js'
import { ErrorsName } from '../../../utils/errors/errors.enum.js'

class TktsManager {
  async create(data) {
    try {
      const tkt = await tktsModel.create(data);
      return { tktId: tkt.id };
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.CREATING_TKT,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }
}

export default TktsManager;
