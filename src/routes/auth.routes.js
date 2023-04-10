import koaRouter from 'koa-router';
import { auth } from '../../auth/index.js';
import { upload, home, login, viewLogout, register, registerNewUser, loginError, pass } from '../controllers/auth.controller.js';

const routerAuth = new koaRouter({
    prefix: '/api'
});

routerAuth.get('/', home);

routerAuth.get('/login', login);

routerAuth.post('/login', pass);

routerAuth.get('/logout', auth, viewLogout);

routerAuth.get('/registro', register);

routerAuth.post('/registro', upload.single('avatar'), registerNewUser);

routerAuth.get('/login-error', loginError);

export { routerAuth };