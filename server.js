import cluster from "cluster";
import connectMongo from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import minimist from "minimist";
import os from "os";
import passport from "passport";
import { Server } from "socket.io";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import { config } from "./src/config/config.js";
import { logger } from "./src/config/configLogger.js";
import {
  addMessage,
  listNormalizedMessages,
} from "./src/controllers/messages.controller.js";
import { routerAuth } from "./src/routes/auth.routes.js";
import { routerCart } from "./src/routes/cart.routes.js";
import { routerHome } from "./src/routes/home.routes.js";
import { routerMessage } from "./src/routes/messages.routes.js";
import { routerProducts } from "./src/routes/products.routes.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const MongoStore = connectMongo.create({
  mongoUrl: config.server.MONGO_URL,
  ttl: config.server.SESSION_TIME,
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coderhouse API",
      version: "0.1.0",
      description: `This API is made with Express and documented with Swagger for the Coderhouse Backend Course. You need to register and login here: ${config.server.HOST_URL}api/register 
            to test all endpoints.`,
    },
    servers: [
      {
        url: config.server.HOST_URL,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use(
  session({
    store: MongoStore,
    secret: config.server.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use("/api/documentation", SwaggerUi.serve, SwaggerUi.setup(specs));
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);
app.use("/api/chat", routerMessage);
app.use("/api/", routerAuth);
app.use("/api/home", routerHome);

app.get("*", (req, res) => {
  const { url, method } = req;
  logger.warn(`Route ${method} ${url} not implemented`);
  res.render("viewInvalidRoute", { url, method });
});

let args = minimist(process.argv.slice(2));

let options = { default: { mode: "FORK" } };
minimist([], options);

const CPU_CORES = os.cpus().length;
const MODE = args.mode || args.m || options.default.mode;
const PORT = process.env.PORT || 8080;

parseInt(process.argv[2]) || args.port || args.p || options.default.port;

if (cluster.isPrimary && MODE == "CLUSTER") {
  for (let i = 0; i < CPU_CORES; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    logger.info(
      `Worker ${process.pid} ${worker.id} ${
        worker.pid
      } ended ${new Date().toLocaleString()}`
    );
    cluster.fork();
  });
} else {
  if (MODE != "FORK" && MODE != "CLUSTER") {
    logger.error(`The requested execution mode ( ${MODE} ) is incorrect.`);
    throw new Error();
  }
  const server = httpServer.listen(PORT, () => {
    logger.info(
      `Server listening on ${config.server.HOST_URL}`
    );
  });

  server.on("error", (err) => logger.error(`server error: ${err}`));

  io.on("connection", async (socket) => {
    logger.info(`New client connected! ${socket.id}`);

    io.sockets.emit("from-server-messages", await listNormalizedMessages());

    socket.on("from-client-messages", async (messages) => {
      await addMessage(messages);
      io.sockets.emit("from-server-messages", await listNormalizedMessages());
    });
  });
}

export default app;
