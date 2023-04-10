import koaRouter from 'koa-router';
import { auth } from '../../auth/index.js';
import { userHome } from '../controllers/home.controller.js';

const routerHome = new koaRouter({
    prefix: '/api/home'
});

routerHome.get('/', auth, userHome);

export { routerHome };

