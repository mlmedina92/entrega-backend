// una clase que recibe un objeto y da un objeto 
export default class TktDTO {
    constructor(item) {
        this.code=item.code
        this.purchase_datetime = item.purchase_datetime
        this.amount = item.amount
        this.purchaser = item.purchaser
    }
}