import config from '../../config.js'
import CartsFile from './carts/CartFile.js'
import CartsRepository from '../repositories/carts.repository.js'

let cartDao

switch (config.persistence) {
    case 'MONGO':
        await import('../mongo/configMongo.js')
        const { default: CartsMongo } = await import('./carts/CartMongo.js')
        cartDao = new CartsRepository(new CartsMongo())
        break;

    case 'FILE':
        cartDao = new CartsFile()
        break;
}

export default cartDao