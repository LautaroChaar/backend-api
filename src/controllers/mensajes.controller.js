import { mensajesDao as apiMensajes } from '../service/index.js';
import { normalize, schema } from 'normalizr';
import { logger } from '../config/configLogger.js';


const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });

const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' });

const schemaMensajes = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' });

const normalizarMensajes = (mensajesId) => normalize(mensajesId, schemaMensajes);


export async function listarMensajesNormalizados() {
    const mensajes = await apiMensajes.getAll();
    const normalizados = normalizarMensajes({ id: 'mensajes', mensajes });
    return normalizados;
};

export async function agregarMensaje(mensaje) {
    await apiMensajes.add(mensaje);
};

export async function getAllMessages(req, res) {
    const {url, method } = req;
    const { username } = req.user;
    logger.info(`Ruta ${method} /api/mensajes${url}`);
    const mensajes = await apiMensajes.getAll();
    res.render('viewChat', {mensajes, username} );
}; 

export async function getMessages(req, res) {
    const {url, method } = req;
    const username = req.params.email;
    logger.info(`Ruta ${method} /api/mensajes${url}`);
    const mensajes = await apiMensajes.getByEmail(username);
    res.render('viewMensajes', {mensajes});
}; 