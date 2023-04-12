import Quoter from "../classes/Quoter.class.js";
import { logger } from "../config/configLogger.js";
import ProductDTO from "../models/dtos/products/productsDtoMongoDB.js";
import { productsDao as productsApi } from "../service/index.js";

const quoter = new Quoter();

export async function getAllProducts(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    const docs = await productsApi.getAll();
    const docsDTO = docs.map((product) => {
      const quotes = {
        dolarPrice: quoter.getPrice(product.price, "USD"),
        btcPrice: quoter.getPrice(product.price, "BTC"),
      };
      return new ProductDTO(product, quotes);
    });
    res.status(200).json(docsDTO);
  } catch (error) {
    return res.json(error);
  }
}

export async function getProductById(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    const product = await productsApi.getById(req.params.id);
    console.log(product);
    const quotes = {
      dolarPrice: quoter.getPrice(product.price, "USD"),
      btcPrice: quoter.getPrice(product.price, "BTC"),
    };

    const dtoProd = new ProductDTO(product, quotes);
    res.render("viewProductDetail", { dtoProd });
  } catch (error) {
    return res.json(error);
  }
}

export async function getProductByCategory(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    const product = await productsApi.getByCategory(req.params.category);
    const arr = [];
    product.map((p) => {
      const quotes = {
        dolarPrice: quoter.getPrice(p.price, "USD"),
        btcPrice: quoter.getPrice(p.price, "BTC"),
      };
      arr.push(new ProductDTO(p, quotes));
    });
    return res.json(arr);
  } catch (error) {
    return res.json(error);
  }
}

export async function addProduct(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    res.status(200).json(await productsApi.add(req.body));
  } catch (error) {
    return res.json(error);
  }
}

export async function updateProduct(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    const elem = { ...req.body, id: Number(req.params.id) };
    res.status(200).json(await productsApi.update(elem));
  } catch (error) {
    return res.json(error);
  }
}

export async function deleteProduct(req, res) {
  try {
    const { url, method } = req;
    logger.info(`Route ${method} /api/products${url}`);
    res.status(202).json(await productsApi.deleteById(req.params.id));
  } catch (error) {
    return res.json(error);
  }
}
