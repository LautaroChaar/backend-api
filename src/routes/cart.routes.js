/**
 * @swagger
 * components:
 *   schemas:
 *     Carts:
 *       type: object
 *       required:
 *         - id
 *         - products
 *         - timestamp
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the cart
 *         products:
 *           type: array
 *           description: Array with cart products
 *         timestamp:
 *           type: string
 *           format: date
 *           description: The date the cart was created
 *       example:
 *         id: 1
 *         products: []
 *         timestamp: 11/4/2023, 16:05:35
 */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API
 * /api/cart:
 *   get:
 *     summary: View cart with user data. Must be login to try it
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: View cart with user data
 *         required: true
 *         type: string
 *       404:
 *         description: Product not found Error
 * /api/cart/{id}/products:
 *   get:
 *     summary: Gets the products from the cart
 *     tags: [Carts]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the cart id.
 *       required: true
 *       type: number
 *     responses:
 *       200:
 *         description: Products from the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Products'
 *       404:
 *         description: Product not found Error
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete a cart with given id.
 *     tags: [Carts]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the cart id.
 *       required: true
 *       type: number
 *     responses:
 *       200:
 *         description: Element {id} removed successfully!.
 *         required: true
 *         type: string
 *       404:
 *         description: Cart not found Error
 * /api/cart/products:
 *   post:
 *     summary: Add product to cart. Must be login to try it
 *     tags: [Carts]
 * /api/cart/buy/products:
 *   post:
 *     summary: Send a purchase order. Must be login to try it
 *     tags: [Carts]
 * /api/cart/{id}/products/{id_prod}:
 *   delete:
 *     summary: Delete a product with given id_prod from the cart with given id.
 *     tags: [Carts]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the cart id.
 *       required: true
 *       type: number
 *     - name: id_prod
 *       in: path
 *       description: Path parameter takes the product id.
 *       required: true
 *       type: number
 */

import { Router } from "express";
import { auth } from "../../auth/index.js";
import {
  addToCart,
  buyProducts,
  cartView,
  deleteCartById,
  deleteCartProduct,
  getCartProducts,
} from "../controllers/cart.controller.js";

const routerCart = new Router();

routerCart.delete("/:id", deleteCartById);

routerCart.get("/:id/products", getCartProducts);

routerCart.get("/", auth, cartView);

routerCart.post("/products", auth, addToCart);

routerCart.post("/buy/products", auth, buyProducts);

routerCart.delete("/:id/products/:id_prod", deleteCartProduct);

export { routerCart };
