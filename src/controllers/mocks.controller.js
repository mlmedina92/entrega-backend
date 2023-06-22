import { faker } from '@faker-js/faker' // Documentación https://fakerjs.dev/api/
import CustomError from '../utils/errors/CustomError.js'
import { ErrorsName } from '../utils/errors/errors.enum.js'

// export function generateUser() {
//   const products = []
//     for(let i=0;i<5;i++){
//         const product = generateProduct()
//         products.push(product)
//     }


//   const user = {
//     id:faker.database.mongodbObjectId(),
//     fisrt_name: faker.name.firstName(),
//     last_name: faker.name.lastName(),
//     gender: faker.name.gender(),
//     sex: faker.name.sex(),
//     phone: faker.phone.number(),
//     address: faker.address.streetAddress(),
//     email: faker.internet.email(),
//     carrito: products,
//   }
//   return user
// }

export const generateProducts = async (req, res) => {
    try {
        const amount = parseInt(req.body.amount || 1) // 1 por defecto
        let prods = []
        
        for (let i = 0; i < amount; i++) {
            const product = {
                id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                code: faker.string.alphanumeric(10), // ej '3e5V7r2Y10'
                price: faker.commerce.price(),
                description: faker.commerce.productDescription(),
                thumbnails: [faker.image.url(), faker.image.url()],
                category: faker.helpers.shuffle(['pizzas', 'empanadas'])[0],
                stock: faker.number.int(100),
                isNew: faker.datatype.boolean()
            }
            prods.push(product)
        }

        res.status(200).json(prods)
    } catch (error) {
        CustomError.createCustomError({
            name: ErrorsName.GENERATING_MOCKS,
            cause: error.cause || error.stack,
            message: error.message,
        })
    }
}