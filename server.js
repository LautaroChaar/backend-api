import  express  from 'express';
import { createServer  } from 'http';
import { Server } from 'socket.io';
import connectMongo from 'connect-mongo';
import session from "express-session";
import passport from 'passport';
import cors from 'cors';
import minimist from 'minimist';
import cluster from 'cluster';
import os from 'os';
import { routerProductos } from './src/routes/productos.routes.js';
import { routerCarrito } from './src/routes/carrito.routes.js';
import { routerMensajes } from './src/routes/mensajes.routes.js';
import { routerAuth } from './src/routes/auth.routes.js';
import { routerHome } from './src/routes/home.routes.js';
import { agregarMensaje, listarMensajesNormalizados } from './src/controllers/mensajes.controller.js';
import { logger } from './src/config/configLogger.js';
import { config } from './src/config/config.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const MongoStore = connectMongo.create({
    mongoUrl: config.server.MONGO_URL,
    ttl: config.server.SESSION_TIME 
});

app.use(session({
    store: MongoStore,
    secret: config.server.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

if(config.server.NODE_ENV == 'development') {
    app.use(cors())
} else {
    app.use(cors({
        origin: `http://localhost:${config.server.PORT}`,
        optionsSuccessStatus: 200,
        methods: "GET, PUT, POST"
    }));
}

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/api/chat', routerMensajes);
app.use('/api/', routerAuth);
app.use('/api/home', routerHome);

app.get('*', (req, res)=>{
    const {url, method } = req;
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.render('viewRutaIncorrecta', { url, method });
});

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
    const server = httpServer.listen(PORT, () => {
        logger.info(`Servidor escuchando en puerto http://localhost:${PORT}/api - PID WORKER ${process.pid}`);
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

export default app;