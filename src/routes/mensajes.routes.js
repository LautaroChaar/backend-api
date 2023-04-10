import koaRouter from 'koa-router';
import { auth } from '../../auth/index.js';
import { getAllMessages } from '../controllers/mensajes.controller.js';

const routerMensajes = new koaRouter({
    prefix: '/api/mensajes'
});

routerMensajes.get('/', auth, getAllMessages); 

export { routerMensajes };