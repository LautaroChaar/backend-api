import { Schema, model } from "mongoose";

const ordenSchema = new Schema({
    email: {type: String, required: true},
    timestamp: {type: String, required: true},
    estado: {type: String, default: 'Generada'},
    id: {type: Number, required: true},
    numeroDeOrden: {type: Number, required: true},
    items: {type: Array, required: true}
})

export const ordenesModel = model('ordenes', ordenSchema);