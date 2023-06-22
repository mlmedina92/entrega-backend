import { messagesModel } from "../../mongo/models/messages.model.js"
import CustomError from '../../../utils/errors/CustomError.js'
import { ErrorsName } from '../../../utils/errors/errors.enum.js'

class MsgsManager {
  async getMsgs() {
    try {
      const getAll = await messagesModel.find();
      return getAll;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.GETTING_MSGS,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }

  async sendMsg(msg) {
    try {
      const send = await messagesModel.create(msg);
      return send;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.SENDING_CART,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }
}

export default MsgsManager;
