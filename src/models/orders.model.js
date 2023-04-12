import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  email: { type: String, required: true },
  timestamp: { type: String, required: true },
  state: { type: String, default: "Generated" },
  id: { type: Number, required: true },
  numberOfOrder: { type: Number, required: true },
  items: { type: Array, required: true },
});

export const ordersModel = model("orders", orderSchema);
