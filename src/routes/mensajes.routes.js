import  express  from 'express';
import { auth } from '../../auth/index.js';
import { getAllMessages, getMessages } from '../controllers/mensajes.controller.js';

const routerMensajes = express.Router();

routerMensajes.get('/', auth, getAllMessages); 

routerMensajes.get('/:email', auth, getMessages); 

export { routerMensajes };