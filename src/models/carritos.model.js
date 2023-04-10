import { Schema, model } from "mongoose";

const carritoSchema = new Schema({
    id: {type: Number, required: true},
    timestamp: {type: String, required: true},
    productos: {type: Array, required: true},
    direccion: {type: String, required: false}
})

export const carritosModel = model('carritos', carritoSchema);