import { Router } from "express";
import CartManager from "../persistence/DAOs/carts/CartMongo.js";
import ProductManager from "../persistence/DAOs/products/productsMongo.js";


const router = Router()

const pm = new ProductManager()
const cm = new CartManager()

// renderiza carrito
router.get('/', async (req, res) => { // si llamo al slash views renderio formualrio
    // si el us no esta logeado
    if (req.session && !req.session.email) {
        res.redirect('/users/login')//redireccion a vista de login
    } else {
        const dataCart = await cm.getCartById(req.session.cartId)
        let total = 0
        let items = []
        for (const item of dataCart.products) {
            const prod = await pm.getProductById(item.productId)
            const subtotal = prod.price * item.quantity
            total += subtotal
            items.push({...prod, 'quantity': item.quantity, 'subtotal': subtotal})
        }
        res.render('carts', { 'prods': items, 'userName': req.session.userName, 'cartId': req.session.cartId, 'total':total })
    }
})

export default router