// archivo para el renderizzado de VISTAS
import { Router } from "express"; //importo router
import ProductManager from "../persistence/DAOs/products/productsMongo.js";

const router = Router()

const pm = new ProductManager()

router.get('/', async (req, res) => { // si llamo al slash views renderio formualrio
    // si el us no esta logeado
    if (req.session && !req.session.email) {
        res.redirect('/users/login')//redireccion a vista de login
    } else {
        // const baseUrl = req.protocol + '://' + req.get('host')
        // const prods = await fetch('http://localhost:8080/api/products')
        const dataProds = await pm.getProducts()
        res.render('productsList', { 'prods': dataProds.payload, 'isAdminRole': req.session.role == 'admin', 'userName': req.session.userName, 'cartId': req.session.cartId })//cdo estoy en / se va a renderizar el handlebars home
    }
})

router.get('/reset/:token', (req, res) => {
    res.render('recuperar', { token: req.params.token })
})

router.get('/perfil', (req, res) => {
    if (req.session && !req.session.email) {
        res.redirect('/users/login')//redireccion a vista de login
    } else {
    res.render('perfil', { uid: req.session.uid })
    }
})

export default router