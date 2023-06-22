import { createTkt } from '../services/tickets.service.js'

export const purchase = async (req, res) => {
    const resp = await createTkt(req.body)
    res.status(200).json(resp)
}