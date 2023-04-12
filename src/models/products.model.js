import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  timestamp: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  quantity: { type: Number, required: false },
  totalPrice: { type: Number, required: false },
});

export const productsModel = model("products", productSchema);
