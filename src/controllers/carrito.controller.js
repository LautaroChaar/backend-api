import { logger } from '../config/configLogger.js';
import { carritosDao as apiCarrito } from '../service/index.js';
import { productosDao as apiProductos } from '../service/index.js';
import { usuariosDao as apiUsuarios } from '../service/index.js';
import twilio from 'twilio';
import { createTransport } from 'nodemailer';
import Usuarios from '../classes/Usuarios.class.js';
import UsuarioDTO from '../models/dtos/usuarios/usuariosDtoMongoDB.js';

const usuario = new Usuarios();

const accountSid = 'ACfb4578ba74862de8f8f3886cffdd8c53';
const authToken = '02387549a0a141d04c6edbbfdf9eb84e';

const TEST_MAIL = 'baby.tillman@ethereal.email';

const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: TEST_MAIL,
       pass: 'BfmWpGTqfPeBGrNqSY'
   }
});

export async function deleteCartById(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    ctx.body = {
        status: 'success',
        data: await apiCarrito.deleteById(ctx.params.id)
    }
}; 

export async function getCartProducts(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    const carrito = await apiCarrito.getById(ctx.params.id);
    ctx.body = {
        status: 'success',
        data: carrito.productos
    }
}; 

export async function cartView(ctx) {
    const {url, method } = ctx.req;
    const datos = await apiUsuarios.getById(ctx.req.user.username)
    const info = {
        edad: usuario.getAge(datos.dateOfBirth),
        aniversario: usuario.getBirthday(datos.dateOfBirth)
    }
    const srcImg = `/uploads/${datos.avatar}`;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    const carrito = await apiCarrito.getById(datos.id);
    const userInfo =  new UsuarioDTO(datos, info);
    ctx.render('viewCarrito', {carrito, userInfo, srcImg});
}; 


export async function addToCart (ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    const id = ctx.req.user.id;
    const carrito = await apiCarrito.getById(id);
    const producto = await apiProductos.getById(ctx.req.body.idProd);
    carrito.productos.push(producto);
    const elem = {...carrito, id: Number(id)};
    await apiCarrito.update(elem);
    ctx.redirect('/api/home');
}; 


export async function buyProducts(ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    const { id, name, username, phone } = ctx.req.user;
    const carrito = await apiCarrito.getById(id);
    const lista = [];
    for (let i=0; i < carrito.productos.length; i++) {
        const element = `<li>${JSON.stringify(carrito.productos[i])}</li>`;
        lista.push(element);
    }

    const string = lista.toString();
    const mailOptions = {
        from: 'Servidor Node.js',
        to: TEST_MAIL,
        subject: `Nuevo pedido de: ${name} (${username})`,
        html: `${string}`
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(info);
    
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
        body: `Hola ${name}, le comunicamos que su pedido ha sido recibido con exito y se encuentra en proceso!`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+${phone}`
    })

    logger.info(message); 

    await apiCarrito.emptyCart(id);
    ctx.redirect('/api/home');
}; 

export async function deleteCartProduct (ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} /api/carrito${url}`);
    const carrito = await apiCarrito.getById(ctx.params.id);
    const index = carrito.productos.findIndex( p => p.id == ctx.params.id_prod);
    if (index != -1 ) {
        carrito.productos.splice(index, 1);
        const elem = {...carrito, id: Number(ctx.params.id)};
        await apiCarrito.update(elem);
    }
    ctx.end();
};



