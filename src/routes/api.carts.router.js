import { Router } from "express";
import { getCart, addToCart, deleteFromCart, purchaseCart } from '../controllers/carts.controller.js'

const router = Router()

router.get('/:cid', getCart)
router.post('/:cid/products/:pid', addToCart)
router.delete('/:cid/products/:pid', deleteFromCart)
router.post('/:cid/purchase', purchaseCart)

// POST '/:cid/products/:pid'
// {
//     id: 0,
//     products: [
//         {
//             quantity: number,
//             product: { objeto tipo producto }
//         }
//     ]
// }

export default router