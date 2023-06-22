// una clase que recibe un objeto y da un objeto 
export default class ItemInCartDTO {
    constructor(item) {
        this.productCode = item.productId
        this.quantity = item.quantity
    }
}