import config from '../../config.js'
import ProductsFile from './products/productsFile.js'
// import ProductsMongo from './products/productsMongo.js'
import ProductsRepository from '../repositories/products.repository.js'

let productsDao

switch (config.persistence) {
    case 'MONGO':
        await import('../mongo/configMongo.js')
        const { default: ProductsMongo } = await import('./products/productsMongo.js')
        productsDao = new ProductsRepository(new ProductsMongo())
        break;

    case 'FILE':
        productsDao = new ProductsFile()
        break;
}

export default productsDao