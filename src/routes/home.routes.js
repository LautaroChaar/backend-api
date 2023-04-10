import { Router } from 'express';
import { auth } from '../../auth/index.js';
import { userHome, viewVariablesEntorno, viewOrder } from '../controllers/home.controller.js';

const routerHome = new Router();

routerHome.get('/', auth, userHome);

routerHome.get('/variablesEntorno', viewVariablesEntorno)

routerHome.get('/ordenes', auth, viewOrder)

export { routerHome };

