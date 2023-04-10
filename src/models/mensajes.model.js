import { Schema, model } from "mongoose";

const mensajeSchema = new Schema({
    usuario: {type: Object, required: true},
    timestamp: {type: String, required: true},
    text: {type: String, required: true},
    id: {type: Number, required: true}
})

export const mensajesModel = model('mensajes', mensajeSchema);