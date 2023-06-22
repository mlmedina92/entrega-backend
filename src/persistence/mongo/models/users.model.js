import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    required: false,
    default: "user",
  },
  userToken: {
    type: String,
    default: null,
  },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
    },
  ],
});

export const userModel = mongoose.model("users", userSchema);