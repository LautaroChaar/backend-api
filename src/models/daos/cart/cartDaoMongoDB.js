import mongoose from "mongoose";
import { config } from "../../../config/config.js";
import { logger } from "../../../config/configLogger.js";
import { cartModel } from "../../cart.model.js";
import MongoDBContainer from "../../containers/mongoDBContainer.js";

class CartsDaoMongoDB extends MongoDBContainer {
  constructor() {
    super(cartModel);
  }

  add = async (id) => {
    try {
      const products = [];
      const timestamp = new Date().toLocaleString();
      const strConn = config.atlas.strConn;
      await mongoose.connect(strConn);
      if ((await this.model.find({ id: id })) == false) {
        const obj = { id: id, products, timestamp };
        await this.model.create(obj);
        return { msg: `Added!` };
      }
      return;
    } catch (error) {
      logger.error(error);
      return { code: 500, msg: `Failed to add` };
    }
  };
}

export default CartsDaoMongoDB;
