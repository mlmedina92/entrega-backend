import mongoose from "mongoose";

// Definición el esquema
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

// Crea y exporta el modelo a partir del esquema
export const tktsModel = mongoose.model('tickets', ticketSchema);