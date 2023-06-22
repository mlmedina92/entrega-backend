// una clase que recibe un objeto y da un objeto 
export default class CreateUserDTO {
    constructor(user) {
        this.email = user.email
        this.password = user.password
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.age = user.age
        }
}
