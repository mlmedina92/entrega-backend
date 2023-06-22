import { socketServer } from '../server.js'
import { get, getById, add, update, remove } from '../services/products.service.js'
import logger from '../utils/winston.js'

export const getAll = async (req, res) => {
    const resp = await get(req.query)
    res.status(200).json(resp)
}

export const getByCode = async (req, res) => {
    const resp = await getById(req.params.pid)
    res.status(200).json(resp)
}

export const addProd = async (req, res) => {
    const resp = await add(req.body)
    if (resp) {
        res.status(200).json({ message: 'Producto agregado con éxito', prod: req.body })
        socketServer.emit('product-added', `Producto "${req.body.title}" agregado con éxito`)
    } else {
        logger.error('Error al agregar producto')
    }
}

export const updateProd = async (req, res) => {
    const resp = await update(req.body)
    if (resp) {
        res.status(200).json({ message: 'Producto actualizado con éxito', prod: req.body })
        socketServer.emit('product-updated', `Producto "${req.body.title}" actualizado con éxito`)
    } else {
        logger.error('Error al actualizar producto')
    }
}

export const deleteProd = async (req, res) => {
    const resp = await remove(req.body.id)
    if (resp) {
        res.status(200).json({ message: 'Producto eliminado con éxito', prod: req.body })
        socketServer.emit('product-removed', `Producto "${req.body.id}" eliminado con éxito`)
    } else {
        logger.error('Error al borrar producto')
    }
}