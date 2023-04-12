import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  id: { type: Number, required: true },
  timestamp: { type: String, required: true },
  products: { type: Array, required: true },
  adress: { type: String, required: false },
});

export const cartModel = model("cart", cartSchema);