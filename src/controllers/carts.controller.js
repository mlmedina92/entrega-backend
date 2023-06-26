import { addTo, deleteFrom, get } from "../services/carts.service.js";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorsName } from "../utils/errors/errors.enum.js";
import stripe from "../utils/stripe.js";

const getBaseUrl = (req) => {
  return req.protocol + "://" + req.get("host");
};

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
      attachments: [
        {
          path: __dirname + "/public/success.jpg",
        },
      ],
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
    const cartApi = await fetch(
      getBaseUrl(req) + `/api/carts/${req.session.cartId}`
    ); // obtengo el carrito
    const dataCart = await cartApi.json();
    let total = 0;
    let items = []; // items con stock suficiente
    let woStockItems = []; // items del carrito sin stock suficiente
    for (const item of dataCart.products) {
      const prod = await fetch(
        getBaseUrl(req) + `/api/products/${item.productId}`
      ); // obtengo todos los datos de los prods del carrito
      const prodData = await prod.json();
      const subtotal = prodData.price * item.quantity;
      if (prodData.stock >= item.quantity) {
        // si hay stock suficiente
        // llamo a la api para actualizar stock
        await fetch(getBaseUrl(req) + `/api/products/${item.productId}`, {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...prodData,
            stock: prodData.stock - item.quantity,
          }),
        });
        total += subtotal;
        items.push({
          ...prodData,
          quantity: item.quantity,
          subtotal: subtotal,
        });
        await deleteFrom({ cid: req.session.cartId, pid: prodData.id }); // borra el prod comprado cart actual
      } else {
        woStockItems.push({
          ...prodData,
          quantity: item.quantity,
          subtotal: subtotal,
        });
      }
    }

    let resp;
    if (items.length > 0) {
      // se puede finalizar compras
      // crear ticket
      const tkt = await fetch(getBaseUrl(req) + `/api/tickets`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Methods": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: Date.now() + Math.random(), // Unique random code
          purchase_datetime: Date.now(),
          amount: total,
          purchaser: req.session.email,
        }),
      });
      const tktData = await tkt.json();
      resp = { success: true };

      sendSuccessEmail({
        username: req.session.email,
        tktId: tktData.tktId,
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
