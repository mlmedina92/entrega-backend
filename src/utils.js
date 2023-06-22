import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bcrypt from "bcrypt"; //modulo para encriptar
import jwt from "jsonwebtoken";
import Stripe from 'stripe';
import "dotenv/config"; // Importo la funcion config() de 'dotenv'.
import config from "./config.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

// funcioalidad pra hashear contraseña pq la voy a usar en muchos lugares
// metodo para hacer el hass: .hash
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); //retorno la contraseña hasheada. 10 es por deafult es un num de rondas
};

//.compare metodo para comparar contraseñas, el us ingresa sus datos omrales y nosotros tenemos q comparar con los datos hasehadeos. le paso la contra q ingreso ell us y la q tenemos en la bd hasheada. el metodo da true o false
export const comparePasswords = async (password, passwordBD) => {
  return bcrypt.compare(password, passwordBD);
};

// * Genero el token de JWT
export const generateToken = (user) => {
  const token = jwt.sign({ user }, config.secretJWT, { expiresIn: "1h" });
  return token;
};

const getDestination = (req, file, cb) => {
  const { type } = req.body;

  if (type === 'profile') {
    cb(null, 'uploads/profiles/');
  } else if (type === 'product') {
    cb(null, 'uploads/products/');
  } else {
    cb(null, 'uploads/documents/');
  }
};

const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  },
});

export const upload = multer({ storage });