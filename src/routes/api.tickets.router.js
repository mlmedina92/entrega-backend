import { Router } from "express";
import { purchase } from '../controllers/tickets.controller.js'

const router = Router()

router.post('/', purchase)

export default router