import { logger } from '../config/configLogger.js';
import { carritosDao as apiCarrito } from '../service/index.js';
import { productosDao as apiProductos } from '../service/index.js';
import { usuariosDao as apiUsuarios } from '../service/index.js';
import { ordenesDao as apiOrdenes } from '../service/index.js';
import { createTransport } from 'nodemailer';
import { config } from '../config/config.js';
import Usuarios from '../classes/Usuarios.class.js';
import UsuarioDTO from '../models/dtos/usuarios/usuariosDtoMongoDB.js';

const usuario = new Usuarios();

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.server.TEST_EMAIL,
        pass: config.server.PASS_EMAIL
    }
});

export async function deleteCartById(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        res.json((await apiCarrito.deleteById(req.params.id)));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function getCartProducts(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        const carrito = await apiCarrito.getById(req.params.id);
        res.json((carrito.productos));
    } catch (error) {
        return res.json( error );
    }
}; 

export async function cartView(req, res) {
    try {
        const {url, method } = req;
        const datos = await apiUsuarios.getById(req.user.username)
        const info = {
            edad: usuario.getAge(datos.dateOfBirth),
            aniversario: usuario.getBirthday(datos.dateOfBirth)
        }
        const srcImg = `/uploads/${datos.avatar}`;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        const carrito = await apiCarrito.getById(datos.id);
        const userInfo =  new UsuarioDTO(datos, info);
        res.render('viewCarrito', {carrito, userInfo, srcImg});
    } catch (error) {
        return res.json( error );
    }
}; 

export async function addToCart (req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        const id = req.user.id;
        const carrito = await apiCarrito.getById(id);
        const producto = await apiProductos.getById(req.body.idProd);
        const cantidad = Number(req.body.cantidad);
        if (carrito.productos.some( p => p.id === producto.id)){
            const obj = carrito.productos.find( e => e.id === producto.id );
            obj.cantidad = obj.cantidad + cantidad;
            obj.precioTotal = obj.precio * obj.cantidad;
        } else {
            producto.cantidad = cantidad;
            producto.precioTotal = producto.precio * cantidad;
            carrito.productos.push(producto);
        }
        const elem = {...carrito, id: Number(id)};
        await apiCarrito.update(elem);
        res.redirect('/api/home');
    } catch (error) {
        return res.json( error );
    }
}; 

export async function buyProducts(req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        const productos = await apiProductos.getAll();
        const { id, name, username, adress } = req.user;
        const carrito = await apiCarrito.getById(id);
        for (let i=0; i < productos.length; i++) {
            if (carrito.productos.some( p => p.id === productos[i].id)){
                const obj = carrito.productos.find( e => e.id === productos[i].id );
                const stock = {id: productos[i].id, stock: productos[i].stock - obj.cantidad};
                await apiProductos.update(stock)
            }
        }

        if (carrito.productos.length != 0) {
        const lista = [];
        const items = [];
        let precioFinal = 0;
        for (let i=0; i < carrito.productos.length; i++) {
            const obj = carrito.productos[i];
            const item = `${obj.nombre} x ${obj.cantidad}, precio: ${obj.precioTotal}`;
            precioFinal += obj.precioTotal;
            const element = `<li>${JSON.stringify(`${obj.nombre} x ${obj.cantidad}, precio: $${obj.precioTotal}`)}</li>`;
            lista.push(element);
            items.push(item);
        }

        const string = lista.toString();
        const mailOptions = {
            from: 'Servidor Node.js',
            to: config.server.TEST_EMAIL,
            subject: `Nuevo pedido de: ${name} (${username})`,
            html: `
            Direccion de entrega: ${adress}</br>
            </br>
            Orden:
            </br>
            ${string}
            </br>
            Precio Total: $${precioFinal}`
        }

        const info = await transporter.sendMail(mailOptions);
        
        const orden = { email: username, items: items, id };
        await apiOrdenes.add(orden);

        logger.info(info);

        await apiCarrito.emptyCart(id);
        res.redirect('/api/home');
        } else {
            res.redirect('/api/carrito');
        }
        
    } catch (error) {
        return res.json( error );
    }
}; 

export async function deleteCartProduct (req, res) {
    try {
        const {url, method } = req;
        logger.info(`Ruta ${method} /api/carrito${url}`);
        const carrito = await apiCarrito.getById(req.params.id);
        const index = carrito.productos.findIndex( p => p.id == req.params.id_prod);
        if (index != -1 ) {
            carrito.productos.splice(index, 1);
            const elem = {...carrito, id: Number(req.params.id)};
            await apiCarrito.update(elem);
        }
        res.end();
    } catch (error) {
        return res.json( error );
    }
};