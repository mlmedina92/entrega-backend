// una clase que recibe un objeto y da un objeto 
export default class BasicUserDTO {
    constructor(user) {
        this.email = user.email
        this.password = user.password
    }
}