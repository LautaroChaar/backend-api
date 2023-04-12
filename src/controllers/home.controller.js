import { logger } from "../config/configLogger.js";
import {
  cartDao as cartApi,
  orderDao as ordersApi,
  productsDao as productsApi,
} from "../service/index.js";

import dotenv from "dotenv";

dotenv.config();

export async function userHome(req, res) {
  const DB_PRODUCTS = await productsApi.getAll();
  const name = req.user.username;
  const userId = req.user.id;
  const { url, method } = req;
  await cartApi.add(userId);
  logger.info(`Route ${method} /home${url}`);
  res.render("viewMain", { name, DB_PRODUCTS });
}

export async function viewOrder(req, res) {
  const userId = req.user.id;
  const orders = await ordersApi.getById(userId);
  res.render("viewOrders", { orders });
}
