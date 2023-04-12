import { createTransport } from "nodemailer";
import Users from "../classes/Users.class.js";
import { config } from "../config/config.js";
import { logger } from "../config/configLogger.js";
import UserDTO from "../models/dtos/users/usersDtoMongoDB.js";
import {
  cartDao as cartApi,
  orderDao as ordersApi,
  productsDao as productsApi,
  userDao as usersApi,
} from "../service/index.js";

const user = new Users();

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.server.TEST_EMAIL,
    pass: config.server.PASS_EMAIL,
  },
});

export async function deleteCartById(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/cart${url}`);
    res.json(await cartApi.deleteById(req.params.id));
  } catch (error) {
    return res.json(error);
  }
}

export async function getCartProducts(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/cart${url}`);
    const cart = await cartApi.getById(req.params.id);
    res.json(cart.products);
  } catch (error) {
    return res.json(error);
  }
}

export async function cartView(req, res) {
  try {
    const { url, method } = req;
    const data = await usersApi.getById(req.user.username);
    const info = {
      age: user.getAge(data.dateOfBirth),
      aniversary: user.getBirthday(data.dateOfBirth),
    };
    const srcImg = `/uploads/${data.avatar}`;
    logger.info(`Route ${method} /api/cart${url}`);
    const cart = await cartApi.getById(data.id);
    const userInfo = new UserDTO(data, info);
    res.render("viewCart", { cart, userInfo, srcImg });
  } catch (error) {
    return res.json(error);
  }
}

export async function addToCart(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/cart${url}`);
    const id = req.user.id;
    const cart = await cartApi.getById(id);
    const product = await productsApi.getById(req.body.idProd);
    const quantity = Number(req.body.quantity);
    if (cart.products.some((p) => p.id === product.id)) {
      const obj = cart.products.find((e) => e.id === product.id);
      obj.quantity = obj.quantity + quantity;
      obj.totalPrice = obj.price * obj.quantity;
    } else {
      product.quantity = quantity;
      product.totalPrice = product.price * quantity;
      cart.products.push(product);
    }
    const elem = { ...cart, id: Number(id) };
    await cartApi.update(elem);
    res.redirect("/api/cart");
  } catch (error) {
    return res.json(error);
  }
}

export async function buyProducts(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/cart${url}`);
    const products = await productsApi.getAll();
    const { id, name, username, adress } = req.user;
    const cart = await cartApi.getById(id);
    for (let i = 0; i < products.length; i++) {
      if (cart.products.some((p) => p.id === products[i].id)) {
        const obj = cart.products.find((e) => e.id === products[i].id);
        const stock = {
          id: products[i].id,
          stock: products[i].stock - obj.quantity,
        };
        await productsApi.update(stock);
      }
    }

    if (cart.products.length != 0) {
      const list = [];
      const items = [];
      let finalPrice = 0;
      for (let i = 0; i < cart.products.length; i++) {
        const obj = cart.products[i];
        const item = `${obj.name} x ${obj.quantity}, price: ${obj.totalPrice}`;
        finalPrice += obj.totalPrice;
        const element = `<li>${JSON.stringify(
          `${obj.name} x ${obj.quantity}, precio: $${obj.totalPrice}`
        )}</li>`;
        list.push(element);
        items.push(item);
      }

      const string = list.toString();
      const mailOptions = {
        from: "Node.js server",
        to: config.server.TEST_EMAIL,
        subject: `New order from: ${name} (${username})`,
        html: `
                Delivery address: ${adress}
                </br>
                Order:
                </br>
                ${string}
                </br>
                Total price: $${finalPrice}`,
      };

      const mailToUser = {
        from: config.server.TEST_EMAIL,
        to: username,
        subject: `Purchase request`,
        html: `
                Your order is already in process!!
                </br>
                Order:
                </br>
                ${string}
                </br>
                Total price: $${finalPrice}`,
      };

      const info = await transporter.sendMail(mailOptions);

      await transporter.sendMail(mailToUser);

      const order = { email: username, items, id };
      await ordersApi.add(order);

      logger.info(info);

      await cartApi.emptyCart(id);
      res.redirect("/api/home");
    } else {
      res.redirect("/api/cart");
    }
  } catch (error) {
    return res.json(error);
  }
}

export async function deleteCartProduct(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/cart${url}`);
    const cart = await cartApi.getById(req.params.id);
    const index = cart.products.findIndex((p) => p.id == req.params.id_prod);
    if (index != -1) {
      cart.products.splice(index, 1);
      const elem = { ...cart, id: Number(req.params.id) };
      await cartApi.update(elem);
    }
    res.end();
  } catch (error) {
    return res.json(error);
  }
}
