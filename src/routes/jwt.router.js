import { Router } from "express";
import { generateToken } from "../utils.js";
// import { userModel } from "../Dao/models/users.model.js";
import UsersManager from '../persistence/DAOs/users/usersMongo.js';

const jwtRouter = Router()
const um = new UsersManager()

jwtRouter.post('/login', async (req, res) => {
    // const { email, password } = req.body
    const user = await um.loginUser(req.body)
    if (user) {
        const token = generateToken(user)
        res.json({token})
    }
    res.json({ message: "Usuario no existente" })
})

export default jwtRouter