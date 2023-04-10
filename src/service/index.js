import { config } from '../config/config.js';

let productosDao;
let carritosDao;
let mensajesDao;
let usuariosDao;
let ordenesDao;

switch (config.server.PERS) {

    case 'mongoDB': 
        const { default: ProductosDaoMongoDB } = await import('../models/daos/productos/productosDaoMongoDB.js');
        const { default: CarritosDaoMongoDB } = await import('../models/daos/carritos/carritosDaoMongoDB.js');
        const { default: MensajesDaoMongoDB } = await import('../models/daos/mensajes/mensajesDaoMongoDB.js');
        const { default: UsuariosDaoMongoDB } = await import('../models/daos/usuarios/usuariosDaoMongoDB.js');
        const { default: OrdenesDaoMongoDB } = await import('../models/daos/ordenes/ordenesDaoMongoDB.js');

        productosDao = new ProductosDaoMongoDB();
        carritosDao = new CarritosDaoMongoDB();
        mensajesDao = new MensajesDaoMongoDB();
        usuariosDao = new UsuariosDaoMongoDB();
        ordenesDao = new OrdenesDaoMongoDB();
        break;

    }

export { productosDao, carritosDao, mensajesDao, usuariosDao, ordenesDao };