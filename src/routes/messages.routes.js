/**
 * @swagger
 * components:
 *   schemas:
 *     Messages:
 *       type: object
 *       required:
 *         - id
 *         - user
 *         - text
 *         - timestamp
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the message
 *         user:
 *           type: object
 *           description: The author of the message
 *         text:
 *           type: string
 *           description: The message
 *         timestamp:
 *           type: string
 *           format: date
 *           description: The date the message was sent
 *       example:
 *         id: 1
 *         user: { email: author@email.com }
 *         text: Hi, i´m Pedro. How are you?
 *         timestamp: 11/4/2023, 16:05:35
 */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: The messages managing API
 * /api/chat:
 *   get:
 *     summary: Get all messages. Must be login to try it
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Get all messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/Messages'
 *       500:
 *         description: Some server error
 * /api/chat/{email}:
 *   get:
 *     summary: Get all messages from the author using the email given. Must be login to try it
 *     tags: [Messages]
 *     parameters:
 *     - name: email
 *       in: path
 *       description: Path parameter takes the author's email
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Path parameter takes the author's email
 *         required: true
 *         type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Messages'
 *       404:
 *         description: Product not found Error


 */

import { Router } from "express";
import { auth } from "../../auth/index.js";
import {
  getAllMessages,
  getMessages,
} from "../controllers/messages.controller.js";

const routerMessage = new Router();

routerMessage.get("/", auth, getAllMessages);

routerMessage.get("/:email", auth, getMessages);

export { routerMessage };
