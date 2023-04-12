import { config } from "../config/config.js";

let productsDao;
let cartDao;
let messageDao;
let userDao;
let orderDao;

switch (config.server.PERS) {
  case "mongoDB":
    const { default: ProductsDaoMongoDB } = await import(
      "../models/daos/products/productsDaoMongoDB.js"
    );
    const { default: CartsDaoMongoDB } = await import(
      "../models/daos/cart/cartDaoMongoDB.js"
    );
    const { default: MessagesDaoMongoDB } = await import(
      "../models/daos/messages/messagesDaoMongoDB.js"
    );
    const { default: UsersDaoMongoDB } = await import(
      "../models/daos/users/usersDaoMongoDB.js"
    );
    const { default: OrdersDaoMongoDB } = await import(
      "../models/daos/orders/ordersDaoMongoDB.js"
    );

    productsDao = new ProductsDaoMongoDB();
    cartDao = new CartsDaoMongoDB();
    messageDao = new MessagesDaoMongoDB();
    userDao = new UsersDaoMongoDB();
    orderDao = new OrdersDaoMongoDB();
    break;
}

export { productsDao, cartDao, messageDao, userDao, orderDao };
