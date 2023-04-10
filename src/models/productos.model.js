import { Schema, model } from "mongoose";

const productoSchema = new Schema({
    id: {type: Number, required: true},
    categoria: {type: String, required: true},
    timestamp: {type: String, required: true},
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    codigo: {type: Number, required: true},
    foto: {type: String, required: true},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true},
    cantidad: {type: Number, required: false},
    precioTotal: {type: Number, required: false}
})

export const productosModel = model('productos', productoSchema);