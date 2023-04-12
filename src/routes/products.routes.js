/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - category
 *         - description
 *         - code
 *         - image
 *         - price
 *         - stock
 *         - timestamp
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         category:
 *           type: string
 *           description: Category of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         code:
 *           type: number
 *           description: Code of the product
 *         image:
 *           type: string
 *           description: Image of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         stock:
 *           type: string
 *           description: Stock of the product
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *         totalPrice:
 *           type: number
 *           description: Total price of the products
 *         timestamp:
 *           type: string
 *           format: date
 *           description: The date the product was added
 *       example:
 *         id: 1
 *         name: T-shirt
 *         category: summer
 *         description: Red summer T-shirt
 *         code: 021
 *         image: Alexander K. Dewdney
 *         price: 9.99
 *         stock: 20
 *         timestamp: 11/4/2023, 16:05:35
 *   requestBodies:
 *     newProduct:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - code
 *         - image
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the product
 *         category:
 *           type: string
 *           description: Category of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         code:
 *           type: number
 *           description: Code of the product
 *         image:
 *           type: string
 *           description: Image of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         stock:
 *           type: string
 *           description: Stock of the product
 *       example:
 *         name: T-shirt
 *         category: summer
 *         description: Red summer T-shirt
 *         code: 021
 *         image: Alexander K. Dewdney
 *         price: 9.99
 *         stock: 20
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Every product available.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/Products'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/newProduct'
 *     responses:
 *       201:
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       500:
 *         description: Some server error
* /api/products/category/{category}:
 *   get:
 *     summary: Gets the products with given category.
 *     tags: [Products]
 *     parameters:
 *     - name: category
 *       in: path
 *       description: Path parameter takes the products category
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Path parameter takes the products category
 *         required: true
 *         type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       404:
 *         description: Product not found Error
 * /api/products/{id}:
 *   get:
 *     summary: Gets the product with given id.
 *     tags: [Products]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the product id
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: View with product detail data
 *         required: true
 *         type: string
 *       404:
 *         description: Product not found Error
 *   put:
 *     summary: Update a product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/newProduct'
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the product properties that will be updated.
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Path parameter takes the product properties that will be updated.
 *         required: true
 *         type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       404:
 *         description: Product not found Error
 *   delete:
 *     summary: Delete a product with given id.
 *     tags: [Products]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Path parameter takes the product id.
 *       required: true
 *       type: number
 *     responses:
 *       200:
 *         description: Element {id} removed successfully!.
 *         required: true
 *         type: string
 *       404:
 *         description: Product not found Error

 */

import { Router } from "express";
import { config } from "../config/config.js";
import { logger } from "../config/configLogger.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductByCategory,
  getProductById,
  updateProduct,
} from "../controllers/products.controller.js";

const routerProducts = new Router();

const isAdmin = config.isAdmin;

const admin = (req, res, next) => {
  if (!isAdmin) {
    logger.error(`Error: Unauthorized login using method ${req.method}`);
    res
      .status(403)
      .json({
        code: 403,
        msg: `Error: Unauthorized login using method ${req.method}`,
      });
  } else {
    next();
  }
};

routerProducts.get("/", getAllProducts);

routerProducts.get("/:id", getProductById);

routerProducts.get("/category/:category", getProductByCategory);

routerProducts.post("/", admin, addProduct);

routerProducts.put("/:id", admin, updateProduct);

routerProducts.delete("/:id", admin, deleteProduct);

export { routerProducts };
