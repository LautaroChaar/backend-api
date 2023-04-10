import koaRouter from 'koa-router';
import { config } from '../config/config.js';
import { logger } from '../config/configLogger.js';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, deleteAllProducts } from '../controllers/productos.controller.js';

const routerProductos = new koaRouter({
    prefix: '/api/productos'
});

const isAdmin = config.isAdmin;

const admin = (ctx, next) => {
    if (!isAdmin) {
        logger.error(`Error: Ingreso no autorizado mediante el metodo ${ctx.req.method}`);
        ctx.body = {
            status: 'Forbidden',
            menssage: {code: 403, msg: `Error: Ingreso no autorizado mediante el metodo ${ctx.req.method}`}
        }
    } else {
        next();
    }
}

routerProductos.get('/', getAllProducts); 

routerProductos.get('/:id', getProductById); 

routerProductos.post('/', admin, addProduct); 

routerProductos.put('/:id', admin, updateProduct); 

routerProductos.delete('/:id', admin, deleteProduct); 

routerProductos.delete('/', admin, deleteAllProducts); 

export { routerProductos };