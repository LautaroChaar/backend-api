import { normalize, schema } from "normalizr";
import { logger } from "../config/configLogger.js";
import { messageDao as messagesApi } from "../service/index.js";

const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" });

const schemaMessage = new schema.Entity(
  "post",
  { author: schemaAuthor },
  { idAttribute: "id" }
);

const schemaMessages = new schema.Entity(
  "posts",
  { messages: [schemaMessage] },
  { idAttribute: "id" }
);

const normalizeMessages = (messageId) => normalize(messageId, schemaMessages);

export async function listNormalizedMessages() {
  const messages = await messagesApi.getAll();
  const normalizedMsg = normalizeMessages({ id: "messages", messages });
  return normalizedMsg;
}

export async function addMessage(msg) {
  await messagesApi.add(msg);
}

export async function getAllMessages(req, res) {
  const { url, method } = req;
  const { username } = req.user;
  logger.info(`Route ${method} /api/chat${url}`);
  const messages = await messagesApi.getAll();
  res.render("viewChat", { messages, username });
}

export async function getMessages(req, res) {
  const { url, method } = req;
  const username = req.params.email;
  logger.info(`Route ${method} /api/chat${url}`);
  const messages = await messagesApi.getByEmail(username);
  res.render("viewMessages", { messages });
}
