import { comparePasswords, hashPassword } from "../../../utils.js"; //cdo alguien se registar usamos el hasheo de la contraseña
import { userModel } from "../../mongo/models/users.model.js";
import { cartsModel } from "../../mongo/models/carts.model.js";
import CustomError from "../../../utils/errors/CustomError.js";
import { ErrorsName } from "../../../utils/errors/errors.enum.js";
import BasicUserDTO from "../../DTOs/users/basicUser.dto.js";

export default class UsersManager {
  async getUsers() {
    const users = await userModel.find();
    const basicUsers = users.map(user => new BasicUserDTO(user));
    return basicUsers;
  }

  async getInactiveUsers(days) {
    const inactiveDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const inactiveUsers = await userModel.find({ lastConnection: { $lt: inactiveDate } });
    return inactiveUsers;
  }

  async create(user) {
    const { email, password } = user; //contraseña q me pasan :123
    try {
      const existeUsuario = await userModel.find({ email });
      if (existeUsuario.length === 0) {
        const cart = await cartsModel.create({
          products: [],
        });
        const hashNewPassword = await hashPassword(password); //para hashear la conrrtraseña q me pasan
        const newUser = { ...user, password: hashNewPassword, cart: cart._id }; //gurado un obj con todo lo q venia en el objeto user y ahora su password vale hashNewPassword q es la contra hasheada.. en mongo atals se guarda
        // password:"$2b$10$NGY21aAVEBOSz2mnI3dp.cjjaWkQmVuv70kWviMoIq" de 123 pasa a esto
        await userModel.create(newUser);
        return newUser;
      } else {
        return null;
      }
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.CONECCTING_MONGO,
        cause: error.cause || error.stack,
        message: error.message,
      });
    }
  }

  async delete(email) {
    const user = await userModel.findOneAndDelete({ email: email });
    return user
  }

  async login(user) {
    //comparar contraseña hasheada con la q ingresa el us
    const { email, password } = user; //DE USER SACO amil y pasaword
    const usuario = await userModel.findOne({ email }); // se fija si existe un us con ese mail registradopasswordBD
    if (usuario) {
      //si existe un us q cumple con mail ejecuto el metodo comparePassword pasandole la passwrd q ingreso el us y la q  esta en la BD . el metodo nos da true o flase
      const isPassword = await comparePasswords(password, usuario.password); //da true o false
      if (isPassword) {
        //si existe
        usuario.last_connection = new Date()
        usuario.save()
        return usuario;
      }
    }
    return null;
  }

  async checkByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkUser(userId) {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, password) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      
      user.password = password;
      await user.save();
  
      return user;
    } catch (error) {
      throw new Error("Error al cambiar la contraseña del usuario");
    }
  }

  async changeUserRole(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      user.role = user.role === "premium" ? 'user' : 'premium';
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      user.documents = user.documents.concat(documents);
      console.log(user.documents);
  
      await user.save();
    } catch (error) {
      throw error;
    }
  }   
}
