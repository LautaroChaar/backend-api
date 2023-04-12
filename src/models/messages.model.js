import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  user: { type: Object, required: true },
  timestamp: { type: String, required: true },
  text: { type: String, required: true },
  id: { type: Number, required: true },
});

export const messagesModel = model("messages", messageSchema);
