import koa from 'koa';
import { koaBody } from 'koa-body';
import koaStatic from 'koa-static';
import passport from 'passport';
import session from 'koa-session';
import Pug from 'koa-pug';
import mongo from 'koa-mongo';
import { logger } from './src/config/configLogger.js';
import { Server } from 'socket.io';
import { agregarMensaje, listarMensajesNormalizados } from './src/controllers/mensajes.controller.js';
import { routerAuth } from './src/routes/auth.routes.js';
import { routerHome } from './src/routes/home.routes.js';
import { routerProductos } from './src/routes/productos.routes.js';
import { routerCarrito } from './src/routes/carrito.routes.js';
import { routerMensajes } from './src/routes/mensajes.routes.js';
import minimist from 'minimist';
import cluster from 'cluster';
import os from 'os';
import { config } from './src/config/config.js';


const app = new koa();
const io = new Server(app);

const pug = new Pug({
    viewPath: './src/views',
    basedir: './src/views',
    app: app 
})

app.use(mongo({
    url: config.server.MONGO_URL,
    pass: config.server.SECRET_KEY,
    max: 600,
    min: 1,
}));

app.keys = [config.server.SECRET_KEY];

app.use(session(app));

app.use(koaBody());

app.use(passport.initialize());
app.use(passport.session());

app.use(koaStatic('./public'));

app.use(routerProductos.routes());
app.use(routerHome.routes());
app.use(routerMensajes.routes());
app.use(routerCarrito.routes());
app.use(routerAuth.routes());

let args = minimist(process.argv.slice(2));

let options = {default: { modo: 'FORK'}};
minimist([], options);

const CPU_CORES = os.cpus().length;
const MODO = args.modo || args.m || options.default.modo;
const PORT =  process.env.PORT || 8080;

parseInt(process.argv[2]) || args.port || args.p || options.default.port ;


if (cluster.isPrimary && MODO == 'CLUSTER') {

    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${process.pid} ${worker.id} ${worker.pid} finalizo ${new Date().toLocaleString()}`);
        cluster.fork();
    });

} else {

    if (MODO != 'FORK' && MODO != 'CLUSTER') {
        logger.error(`El modo de ejecucion solicitado ( ${MODO} ) es incorrecto.`)
        throw new Error()
    } 

    const server = app.listen(PORT, () => {
        logger.info(`Servidor escuchando en puerto http://localhost:${PORT}/api`);
    });

    server.on('error', err => logger.error(`error en server ${err}`));

    io.on('connection', async socket => {
        logger.info(`Nuevo cliente conectado! ${socket.id}`);

        io.sockets.emit('from-server-messages', await listarMensajesNormalizados());

        socket.on('from-client-messages', async messages => {
            await agregarMensaje(messages);
            io.sockets.emit('from-server-messages', await listarMensajesNormalizados())
        });

    });
}

export {app};