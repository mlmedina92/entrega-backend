import { generateToken } from "../../utils.js";
import BasicUserDTO from "../DTOs/users/basicUser.dto.js";
import CreateUserDTO from "../DTOs/users/createUser.dto.js";
import FullUserDTO from "../DTOs/users/fullUser.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUsers() {
    const users = await this.dao.getUsers();
    return users;
  }

  async getInactiveUsers(days) {
    const users = await this.dao.getInactiveUsers(days)
    return users
  }

  async deleteUser(email) {
    const user = await this.dao.delete(email);
    return user;
  }

  async create(user) {
    const createUser = new CreateUserDTO(user);
    const userDAO = await this.dao.create(createUser);
    const fullUser = new FullUserDTO(userDAO);
    return fullUser;
  }

  async login(userObj) {
    const basicUser = new BasicUserDTO(userObj);
    const user = await this.dao.login(basicUser);
    if (user) {
      //si el us existe ccreo esas sesiones
      const token = generateToken(user);
      const fullUser = new FullUserDTO(user);
      return { token: token, user: fullUser };
    } else {
      return null;
    }
  }

  async checkByEmail(email) {
    const user = await this.dao.checkByEmail(email);
    return user;
  }

  async checkUser(userId) {
    const user = await this.dao.checkUser(userId);
    return user;
  }

  async changePassword(userId, password) {
    return await this.dao.changePassword(userId, password);
  }

  async changeUserRole(userId) {
    const updatedUser = await this.dao.changeUserRole(userId);
    return updatedUser;
  }

  async uploadDocuments(userId, documents) {
    await this.dao.uploadDocuments(userId, documents);
  }
}
