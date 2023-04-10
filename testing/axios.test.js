import axios from 'axios';
import { logger } from '../src/config/configLogger.js';

const PORT =  process.env.PORT || 8080;

async function obtenerListaDeProductos() {
    return axios.get(`http://localhost:${PORT}/api/productos`)
    .then(response => {
        logger.info(response.data);
        })
    .catch(error => {
        logger.error(error)
        })
}

async function agregarNuevoProducto() {
    return axios.post(`http://localhost:${PORT}/api/productos`, {
    nombre: "Pantalon",
    descripcion: "Pantalon de jean negro",
    precio: 15000,
    codigo: 465,
    stock: 20,
    foto: " "
})
.then(response => {
    logger.info(response.data);
    })
.catch(error => {
    logger.error(error);
    })
}

async function actualizarProducto() {
    return axios.put(`http://localhost:${PORT}/api/productos/1`, {
        codigo: 800,
        precio: 20000,
        foto: "https://sendeyo.com/updownload/file/script/136448cba4daaa2e2387b10e1e68ee3c.webp"
    })
    .then(response => {
        logger.info(response.data);
    })
    .catch(error => {
        logger.error(error);
    })
}

async function eliminarUnProducto() {
    return axios.delete(`http://localhost:${PORT}/api/productos/3`)
    .then(response => {
        logger.info(response.data);
    })
    .catch(error => {
        logger.error(error);
    })
}

Promise.all([await obtenerListaDeProductos(), await agregarNuevoProducto(), await actualizarProducto(), await eliminarUnProducto()])
.then(function(res) {
    const prods = res[0];
    const newProd = res[1];
    const updateProd = res[2];
    const deleteProd = res[3];
})



