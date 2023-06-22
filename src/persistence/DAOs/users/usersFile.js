import fs from 'fs'
import { __dirname } from '../../../utils.js'
import CustomError from '../../../utils/errors/CustomError.js'
import { ErrorsName } from '../../../utils/errors/errors.enum.js'

const path = __dirname + '/Users.json'

export default class UsersFile {
    async login() {
        // TODO
    }

    // async getAll() {
    //     try {
    //         if (fs.existsSync(path)) {
    //             const usersFile = await fs.promises.readFile(path, 'utf-8')
    //             return JSON.parse(usersFile)
    //         }
    //         else {
    //             return []
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async create(objUser) {
        try {
            const usersFile = await this.getAll()
            let id
            if (usersFile.length !== 0) {
                id = usersFile[usersFile.length - 1].id + 1

            } else {
                id = 1
            }
            const newUser = { id, ...objUser }
            usersFile.push(newUser)
            await fs.promises.writeFile(path, JSON.stringify(usersFile))
            return newUser

        } catch (error) {
            CustomError.createCustomError({
              name: ErrorsName.CREATING_USER,
              cause: error.cause || error.stack,
              message: error.message,
            })
          }
    }
}