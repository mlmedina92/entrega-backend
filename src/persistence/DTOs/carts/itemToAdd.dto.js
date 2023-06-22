// una clase que recibe un objeto y da un objeto 
export default class ItemToAddDTO {
    constructor(item) {
        this.cid=item.cid
        this.pid = item.pid
        this.quantity=Number(item.quantity)
    }
}