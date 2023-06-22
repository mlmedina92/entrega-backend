// una clase que recibe un objeto y da un objeto 
export default class ItemToDeleteDTO {
    constructor(item) {
        this.cid=item.cid
        this.pid = item.pid
    }
}