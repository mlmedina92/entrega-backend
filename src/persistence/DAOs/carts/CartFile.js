import fs from 'fs'
import logger from '../../../utils/winston.js'

export default class CartManager {
    constructor(path) { //Cdo alguien cree una instancia, un objeto tiene que pasar la ruta de donde se va a guardar esa inf. que nos envien
        this.path = path
        this.carts = []
    }

    async saveFile() {
        //Guardo o sobreescribo el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8')
        logger.debug('Guardado con éxito: ' + this.path)
    }

    async readFile() {
        // Leer la inf del archivo 
        try {
            if (!fs.existsSync(this.path)) {
                logger.debug('Error: Archivo no encontrado', this.path);
                return false;
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data) //la data que trae la promesa la guardo en mi obj
            logger.debug('Leido con exito: ' + this.path)
            return this.carts
        } catch (error) {
            logger.error('Error: ' + error)
        }

        return false;
    }

    async createCart() {
        // api/carts
        await this.readFile() //Retorna el arreglo de prods

        const newCart = {
            "id": this.carts.length,
            "products": []
        }

        this.carts.push(newCart)//Carts es el arreglo de carritos

        this.saveFile()

        return newCart
    }

    async getCartById(id) {
        // api/cart/1
        await this.readFile()

        const cart = this.carts.find((cart) => cart.id === id)

        if (!cart) {//si no lo encuentra
            logger.debug('El carrito ' + id + ' no se encontró')
            return false
        }

        return cart
    }

    async addToCart(cid, pid, quantity) {
        const cart = await this.getCartById(cid) //trae un solo carrito [{},{}]

        if (!cart) {
            return false
        }

        const prodInCart = cart.products.find((prodInCart) => prodInCart.productId === pid)

        if (prodInCart) {//Si existe el producto
            prodInCart.quantity += quantity
        } else {//Si no lo agrega
            cart.products.push({
                "productId": pid,
                "quantity": quantity
            })
        }

        this.saveFile()

        logger.debug('Carrito sactualizado con éxito');
        return cart
    }
}
