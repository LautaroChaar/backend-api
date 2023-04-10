import { Router } from 'express';
import { config } from '../config/config.js';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getCartProducts, addToCart, deleteCartProduct, viewGraphql } from '../graphql/resolver.js';
import { auth } from '../../auth/index.js';


const isAdmin = config.isAdmin;

const admin = (req, res, next) => {
    if (!isAdmin) {
        logger.error(`Error: Ingreso no autorizado mediante el metodo ${req.method}`);
        res.status(403).json({code: 403, msg: `Error: Ingreso no autorizado mediante el metodo ${req.method}`});
    } else {
        next();
    }
}

const routerGraphql = new Router();

routerGraphql.get('/', viewGraphql);

routerGraphql.get('/productos', getAllProducts); 

routerGraphql.get('/productos/:id', getProductById); 

routerGraphql.post('/productos', admin, addProduct); 

routerGraphql.post('/productos/actualizar', admin, updateProduct); 

routerGraphql.post('/productos/eliminar/', admin, deleteProduct); 

routerGraphql.get('/carrito/productos', auth, getCartProducts);  

routerGraphql.post('/carrito/productos', auth, addToCart); 

routerGraphql.post('/carrito/productos/eliminar', auth, deleteCartProduct);

export { routerGraphql };