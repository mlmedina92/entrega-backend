import { Router } from "express";
import { generateProducts } from '../controllers/mocks.controller.js'

const router = Router()

router.post('/', generateProducts)

export default router