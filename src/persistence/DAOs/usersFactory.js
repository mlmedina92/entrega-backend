import config from '../../config.js'
import UsersFile from './users/usersFile.js'
import UsersRepository from '../repositories/users.repository.js'

let usersDao

switch (config.persistence) {
  case 'MONGO':
    await import('../mongo/configMongo.js')
    const { default: UsersMongo } = await import('./users/usersMongo.js')
    usersDao = new UsersRepository(new UsersMongo())
    break;

  case 'FILE':
    usersDao = new UsersFile()
    break;
}

export default usersDao