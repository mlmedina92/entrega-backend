import { cartsModel } from "../../mongo/models/carts.model.js"
import CustomError from '../../../utils/errors/CustomError.js'
import { ErrorsName } from '../../../utils/errors/errors.enum.js'

export default class CartManager {
  async createCart() {
    try {
      const cart = await cartsModel.create({
        products: [],
      });
      return cart;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.CREATING_CART,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id).populate('products');
      return cart;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.GETTING_CART,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }

  async addToCart({ cid, pid, quantity }) {
    try {
      const cart = await cartsModel.findById(cid);

      // me fijo si el carrito esta creado
      if (!!cart) {

        const prod = cart.products.find(e => e.productId === pid)

        // despues me fijo que el producto ya exista en el carrito
        if (!!prod) {
          const update = cart.products.map(prod => {
            if (prod.productId == pid) {
              prod.quantity += quantity
            }
            return prod
          })
          return await cartsModel.findByIdAndUpdate(cid, { products: update })
        } else {
          await cartsModel.findOneAndUpdate(
            { _id: cid },
            { $push: { products: { productId: pid, quantity: quantity } } }
          );
          return { success: true }
        }
      } else {
        return { error: "Carrito no encontrado" };
      }
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.ADDING_CART,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }

  async deleteFromCart({ cid, pid }) {
    try {
      let cart = await cartsModel.findById(cid);
      if (cart) {
        cart.products = cart.products.filter(item => item.productId.toString() !== pid.toString());
        await cart.save();
      }
      return { success: true, redirectTo: '/cart' };
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.DELETING_CART,
        cause: error.cause || error.stack,
        message: error.message,
      });
    }
  }  
}
