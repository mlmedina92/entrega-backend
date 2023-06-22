import prodsDao from "../persistence/DAOs/productsFactory.js"

export const get = async (query) => {
     const prods = await prodsDao.get(query)
     return prods
}

export const getById = async (id) => {
     const prods = await prodsDao.getById(id)
     return prods
}

export const add = async (prod) => {
     const prods = await prodsDao.addProduct(prod)
     return prods
}

export const update = async (prod) => {
     const prods = await prodsDao.updateProductById(prod)
     return prods
}

export const remove = async (id) => {
     const prods = await prodsDao.removeProductById(id)
     return prods
}