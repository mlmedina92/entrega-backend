import dotenv from 'dotenv'

dotenv.config()

export default {
    myUrl: process.env.MY_URL || 'http://localhost:8080',
    mongo_uri: process.env.URI,
    persistence: process.env.PERSISTENCE || 'FILE',
    node_env:process.env.NODE_ENV,
    port: process.env.PORT,
    gmail_password: process.env.GMAIL_PASSWORD,
    gmail_user: process.env.GMAIL_USER,
    twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
    twilio_sid: process.env.TWILIO_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    secretJWT: process.env.SECRET_JWT || "secretCode",
    stripePass: process.env.STRIPE_PASS || "stripePass"
}