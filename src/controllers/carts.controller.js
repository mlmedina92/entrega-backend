import { addTo, deleteFrom, get } from "../services/carts.service.js";
import { getById, update } from "../services/products.service.js";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorsName } from "../utils/errors/errors.enum.js";
import stripe from "../utils/stripe.js";
import TktsManager from '../persistence/DAOs/tickets/TicketsMongo.js'
import { transporter } from "../utils/nodemailer.js";

const tm = new TktsManager()

export const addToCart = async (req, res) => {
  const resp = await addTo({ ...req.params, ...req.body });
  res.status(200).json(resp);
};

export const deleteFromCart = async (req, res) => {
  const resp = await deleteFrom(req.params);
  res.status(200).json(resp);
};

export const getCart = async (req, res) => {
  const resp = await get(req.params);
  res.status(200).json(resp);
};

const sendSuccessEmail = async (data) => {
  try {
    const username = data.username;
    const tktId = data.tktId;
    const total = data.total;

    await transporter.sendMail({
      from: "CODERHOUSE",
      to: [data.username, "lm30540@gmail.com"],
      subject: "Compra exitosa en Pizza!",
      html: `<h1>Compra exitodo en Pizza</h1><p>Felicitaciones ${username} por su compra #${tktId}</p><p>Total $${total}</p>`,
    });
  } catch (error) {
    CustomError.createCustomError({
      name: ErrorsName.SENDING_EMAIL,
      cause: error.cause || error.stack,
      message: error.message,
    });
  }
};

export const processPayment = async (req, res) => {
  const { amount, currency, source, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: source,
      description,
      confirm: true,
    });

    res.json({ paymentIntent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const dataCart = await get(req.params);
    let total = 0;
    let items = []; // items con stock suficiente
    let woStockItems = []; // items del carrito sin stock suficiente
    for (const item of dataCart.products) {
      const prod = await getById(item.productId); // obtengo todos los datos de los prods del carrito
      const subtotal = prod.price * item.quantity;
      if (prod.stock >= item.quantity) {
        // si hay stock suficiente
        // llamo a la api para actualizar stock
        await update({
          ...prod,
          stock: prod.stock - item.quantity,
        });
        total += subtotal;
        items.push({
          ...prod,
          quantity: item.quantity,
          subtotal: subtotal,
        });
        await deleteFrom({ cid: dataCart._id, pid: prod.id }); // borra el prod comprado cart actual
      } else {
        woStockItems.push({
          ...prod,
          quantity: item.quantity,
          subtotal: subtotal,
        });
      }
    }

    let resp;
    if (items.length > 0) {
      // se puede finalizar compras
      // crear ticket
      const tkt = await tm.create({
        code: Date.now() + Math.random(), // Unique random code
        purchase_datetime: Date.now(),
        amount: total,
        purchaser: req.session.email,
      });
      resp = { success: true };
      sendSuccessEmail({
        username: req.session.email,
        tktId: tkt,
        total: total,
      });
    } else {
      resp = { success: false };
    }

    if (woStockItems.length > 0) {
      // productos sin stock que no se pudieron comprar
      resp = {
        ...resp,
        redirectTo: "/cart", // para ver el resto de los productos que quedaron en el carrito
      };
    } else {
      resp = {
        ...resp,
        redirectTo: "/", // home (carrito vacio)
      };
    }

    res.status(200).json(resp);
  } catch (error) {
    CustomError.createCustomError({
      name: ErrorsName.PURCHASE_CART,
      cause: error.cause || error.stack,
      message: error.message,
    });
  }
};
