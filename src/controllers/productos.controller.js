import { logger } from '../config/configLogger.js';
import { productosDao as apiProductos } from '../service/index.js';
import ProductoDTO from '../models/dtos/productos/productosDtoMongoDB.js';
import Cotizador from '../classes/Cotizador.class.js';

const cot = new Cotizador();

export async function getAllProducts(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    const docs  = await apiProductos.getAll();
    const docsDto = docs.map(producto => {
        const cotizaciones = {
            precioDolar: cot.getPrice(producto.precio, 'USD'),
            precioBTC: cot.getPrice(producto.precio, 'BTC')
        }
        return new ProductoDTO(producto, cotizaciones);
    })
    ctx.body = {
        status: 'success',
        data: docsDto
    }
}; 

export async function getProductById(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    const producto = await apiProductos.getById(ctx.params.id);
    const cotizaciones = {
        precioDolar: cot.getPrice(producto.precio, 'USD'),
        precioBTC: cot.getPrice(producto.precio, 'BTC')
    }
    ctx.body = {
        status: 'success',
        data: new ProductoDTO(producto, cotizaciones)
    }
}; 

export async function addProduct(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    const newProd = {
        precio: ctx.request.body.precio,
        nombre: ctx.request.body.nombre,
        foto: ctx.request.body.foto,
        codigo: ctx.request.body.codigo,
        stock: ctx.request.body.stock,
        descripcion: ctx.request.body.descripcion
    }
    ctx.body = {
        status: 'success',
        data: await apiProductos.add(newProd)
    }
}; 

export async function updateProduct(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    const elem = {...ctx.request.body, id: Number(ctx.params.id)};
    ctx.body = {
        status: 'success',
        data: await apiProductos.update(elem)
    }
}; 

export async function deleteProduct(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    ctx.body = {
        status: 'success',
        data: await apiProductos.deleteById(ctx.params.id)
    }
}; 

export async function deleteAllProducts(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/productos${url}`);
    ctx.body = {
        status: 'success',
        data: await apiProductos.deleteAll()
    }
}; 

