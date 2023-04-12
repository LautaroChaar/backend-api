/**
 * @swagger
 * tags:
 *   name: Home
 *   description: View home
 * /api/home:
 *   get:
 *     summary: Must be login to try it
 *     tags: [Home]
 * /api/home/orders:
 *   get:
 *     summary: Gets user orders. Must be login to try it
 *     tags: [Home]
 */

import { Router } from "express";
import { auth } from "../../auth/index.js";
import { userHome, viewOrder } from "../controllers/home.controller.js";

const routerHome = new Router();

routerHome.get("/", auth, userHome);

routerHome.get("/orders", auth, viewOrder);

export { routerHome };
