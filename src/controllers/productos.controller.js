import { logger } from '../config/configLogger.js';
import { productosDao as apiProductos } from '../service/index.js';
import ProductoDTO from '../models/dtos/productos/productosDtoMongoDB.js';
import Cotizador from '../classes/Cotizador.class.js';

const cot = new Cotizador();

export async function getAllProducts(req, res) {
    try {
        const { url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        const docs  = await apiProductos.getAll();
        const docsDto = docs.map(producto => {
            const cotizaciones = {
                precioDolar: cot.getPrice(producto.precio, 'USD'),
                precioBTC: cot.getPrice(producto.precio, 'BTC')
            }
            return new ProductoDTO(producto, cotizaciones);
        })
        res.status(200).json((docsDto));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function getProductById(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        const producto = await apiProductos.getById(req.params.id);
        const cotizaciones = {
        precioDolar: cot.getPrice(producto.precio, 'USD'),
        precioBTC: cot.getPrice(producto.precio, 'BTC')
    }
        const dtoProd = new ProductoDTO(producto, cotizaciones)
        res.render('viewDetalleProducto', { dtoProd })
    } catch (error) {
        return res.json( error );
    }
}; 

export async function getProductByCategory(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        const producto = await apiProductos.getByCategory(req.params.category);
        const arr = [];
        producto.map( p =>  {
            const cotizaciones = {
            precioDolar: cot.getPrice(p.precio, 'USD'),
            precioBTC: cot.getPrice(p.precio, 'BTC')
        }
        arr.push(new ProductoDTO(p, cotizaciones));
        })
        return res.json(arr);
    } catch (error) {
        return res.json( error );
    }
}; 

export async function addProduct(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        res.status(200).json((await apiProductos.add(req.body)));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function updateProduct(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        const elem = {...req.body, id: Number(req.params.id)};
        res.status(200).json((await apiProductos.update(elem)));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function deleteProduct(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        res.status(202).json((await apiProductos.deleteById(req.params.id)));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function deleteAllProducts(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/productos${url}`);
        res.json((await apiProductos.deleteAll()));
    } catch (error) {
        return res.json( error );
    }
}; 

