import cartDao from "../persistence/DAOs/cartsFactory.js"

export const addTo = async (query) => {
     const cart = await cartDao.addToCart(query)
     return cart
}

export const deleteFrom = async (query) => {
     const cart = await cartDao.deleteFromCart(query)
     return cart
}

export const get = async (query) => {
     const cart = await cartDao.getCart(query)
     return cart
}