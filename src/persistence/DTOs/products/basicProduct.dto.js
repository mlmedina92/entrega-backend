// una clase que recibe un objeto y da un objeto 
export default class BasicProductDTO {
    constructor(prod) {
        this.id=prod._id
        this.thumbnails=prod.thumbnails
        this.title = prod.title
        this.price=prod.price
        this.code=prod.code
        this.stock=prod.stock
        this.isNew=prod.isNew
        this.category = prod.category
        this.description = prod.description
    }
}