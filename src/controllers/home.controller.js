import { logger } from '../config/configLogger.js';
import { productosDao as apiProductos } from '../service/index.js';
import { carritosDao as apiCarritos } from '../service/index.js';


export const userHome = async (body, ctx) => {
    const DB_PRODUCTS = await apiProductos.getAll();
    const nombre = ctx
    // const nombre = body.req.user.username;
    // const userId = body.req.user.id;
    // const {url, method } = body.req;
    // await apiCarritos.add(userId);
    // logger.info(`Ruta ${method} /home${url}`);
    // body.render('viewMain', { nombre, DB_PRODUCTS });
    await body.render('viewMain', { nombre, DB_PRODUCTS });
};

