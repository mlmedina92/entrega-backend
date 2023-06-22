import { Router } from "express";
import { getUsersController, loginUser, createUser, changeRole, resetPassword, requestPasswordReset } from '../controllers/users.controller.js'
import { upload } from "../utils.js";

const router = Router()

router.get('/', getUsersController)

router.post('/login', loginUser)
router.post('/registro', createUser)

router.post('/reset', requestPasswordReset)
router.post('/reset/:token', resetPassword)
router.post('/:uid/documents', upload.array('documents'), changeRole)
router.get('/premium/:uid', changeRole)

export default router


// // archivo para el renderizzado de VISTAS
// import { Router } from "express"; //importo router
// import UsersManager from "../dao/mongoManager/UsersManager.js";
// import { generateToken } from "../utils/helper.js";

// const router = Router()

// const usersManager = new UsersManager()// traigo las fncionalidades de Usermanager cisntanciando la clase

// router.post('/login', async (req, res) => { // si llamo al slash views renderio formualrio
//     const { email, password } = req.body
//     const user = await usersManager.loginUser(req.body)
//     if (user) { //si el us existe ccreo esas sesiones
//         const token = generateToken(user)
//         req.session.email = email //creo sesion
//         req.session.password = password //creo sesion
//         req.session.userName = user.first_name
//         req.session.role = user.role
//         res.cookie('token', token, {httpOnly: true}).redirect('/') //redireccion a home, httpOnly hace que la info del token no pueda ser extraido en el front
//     } else {
//         res.redirect('/users/errorLogin')// si no exite lo lleva a otra vista
//     }
// })

// router.post('/registro', async (req, res) => {//CDO UNA EPROSNA SE REGISTRA GIARDA LA INF EN BD
//     const newUser = await usersManager.createUser(req.body)
//     if (newUser) {//si se creo el us lo redirecciono al home
//         res.redirect('/')
//     } else {
//         res.redirect('/errorRegistro')// si ya exite lo lleva a otra vista
//     }
// })

// export default router 