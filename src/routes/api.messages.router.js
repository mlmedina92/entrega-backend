import { Router } from "express";
import { transporter } from "../utils/nodemailer.js";
import { client } from "../utils/twilio.js";
import config from "../config.js";
import { __dirname } from '../utils.js'
import CustomError from '../utils/errors/CustomError.js'
import { ErrorsName } from '../utils/errors/errors.enum.js'

const router = Router()

router.post('/', async (req, res) => {
    const { email, frase } = req.body
    try {
        const mail = await transporter.sendMail({
            from: 'CODERCOMMERCE',
            to: email,
            subject: 'PRUEBA',
            html: `<h2>${frase}</h2>`
        })
        res.send('SENT')
    } catch (error) {
        CustomError.createCustomError({
          name: ErrorsName.SENDING_EMAIL,
          cause: error.cause || error.stack,
          message: error.message,
        })
      }
})

router.get('/twilio', async (req, res) => {
    await client.messages.create({
        body: 'Probando twilio',
        from: config.twilio_phone_number,
        to: '+5492494545017'
    })
    res.send('Probando twilio')
})


export default router