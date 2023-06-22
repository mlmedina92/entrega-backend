// una clase que recibe un objeto y da un objeto 
export default class FullUserDTO {
    constructor(user) {
        this.email = user.email
        this.password = user.password
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.full_name = `${user.first_name} ${user.last_name}`
        this.age = user.age
        this.cartId = user.cart?.toString()
        this.role = user.role
    }
}
