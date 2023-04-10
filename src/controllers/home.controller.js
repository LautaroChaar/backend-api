import { logger } from '../config/configLogger.js';
import { productosDao as apiProductos } from '../service/index.js';
import { carritosDao as apiCarritos } from '../service/index.js';
import { ordenesDao as apiOrdenes } from '../service/index.js';

import dotenv from 'dotenv';

dotenv.config();

export async function userHome(req, res) {
    const DB_PRODUCTS = await apiProductos.getAll();
    const nombre = req.user.username;
    const userId = req.user.id;
    const {url, method } = req;
    await apiCarritos.add(userId);
    logger.info(`Ruta ${method} /home${url}`);
    res.render('viewMain', { nombre, DB_PRODUCTS });
};

export async function viewVariablesEntorno(req, res) {
    const PORT = process.env.PORT;
    const PERS = process.env.PERS;
    const SECRET_KEY = process.env.SECRET_KEY;
    const MONGO_URL = process.env.MONGO_URL;
    const NODE_ENV = process.env.NODE_ENV;
    const SESSION_TIME = process.env.SESSION_TIME;
    res.render('viewVariablesEntorno', { PORT, PERS, SECRET_KEY, MONGO_URL, NODE_ENV, SESSION_TIME });
} 

export async function viewOrder(req, res) {
    const userId = req.user.id;
    const ordenes = await apiOrdenes.getById(userId);
    console.log(ordenes)
    res.render('viewOrdenes', { ordenes });
} 