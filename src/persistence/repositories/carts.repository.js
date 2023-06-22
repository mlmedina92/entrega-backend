import ItemToAddDTO from "../DTOs/carts/itemToAdd.dto.js";
import ItemToDeleteDTO from "../DTOs/carts/itemToDelete.dto.js";
import ItemInCartDTO from "../DTOs/carts/itemInCart.dto.js";

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async addToCart(item) {
        const itemToAdd = new ItemToAddDTO(item)
        const cartRes = await this.dao.addToCart(itemToAdd)
        if (cartRes) {
            return cartRes
        } else {
            return null
        }
    }

    async deleteFromCart(item) {
        const itemToDelete = new ItemToDeleteDTO(item)
        const cartRes = await this.dao.deleteFromCart(itemToDelete)
        if (cartRes) {
            return cartRes
        } else {
            return null
        }
    }

    async getCart({cid}) {
        const cartDAO = await this.dao.getCartById(cid)
        return cartDAO
    }
}