import usersDao from "../persistence/DAOs/usersFactory.js";

export const getUsers = async () => {
  const users = await usersDao.getUsers()
  return users
}

export const getInactiveUsers = async (days) => {
  const users = await usersDao.getInactiveUsers(days)
  return users
}

export const deleteUser = async (email) => {
  const user = await usersDao.deleteUser(email)
  return user
}

export const login = async (objUser) => {
  const user = await usersDao.login(objUser);
  return user;
};

export const create = async (objUser) => {
  const newUser = await usersDao.create(objUser);
  return newUser;
};

export const checkByEmail = async (email) => {
  const emailChecked = await usersDao.checkByEmail(email);
  return emailChecked;
};

export const checkUser = async (userId) => {
  const user = await usersDao.checkUser(userId);
  return user;
};

export const changeUserRole = async (userId) => {
  const role = await usersDao.changeUserRole(userId);
  return role;
};

export const uploadDocuments = async (userId, documents) => {
  const user = await usersDao.uploadDocuments(userId, documents);
  return user;
};