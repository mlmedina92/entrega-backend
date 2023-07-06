import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
            },
            quantity: {
              type: Number,
            },
          },
        ],
        required: true,
      },
})

export const cartsModel = mongoose.model('Carts', cartsSchema)