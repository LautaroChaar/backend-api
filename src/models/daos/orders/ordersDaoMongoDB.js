import MongoDBContainer from "../../containers/mongoDBContainer.js";
import { ordersModel } from "../../orders.model.js";

class OrdersDaoMongoDB extends MongoDBContainer {
  constructor() {
    super(ordersModel);
  }

  add = async (elem) => {
    try {
      const timestamp = new Date().toLocaleString();
      await this.conn.connect();
      const objs = await this.model.find();
      let numberOrder;
      if (objs.length === 0) {
        numberOrder = 1;
      } else {
        numberOrder = objs[objs.length - 1].numberOfOrder + 1;
      }
      const obj = { ...elem, timestamp, numberOfOrder: numberOrder };
      await this.model.create(obj);
      return obj;
    } catch (error) {
      logger.error(error);
      throw new CustomError(500, "Add", "Error adding element.");
    } finally {
      await this.conn.disconnect();
    }
  };

  getById = async (id) => {
    try {
      await this.conn.connect();
      if ((await this.model.find({ id: id })) == false) {
        throw new CustomError(404, "Get by id", "Element not found.");
      } else {
        let res = await this.model.find({ id: id });
        return res;
      }
    } catch (error) {
      logger.error(error);
      throw new CustomError(500, "Get by id", "Error completing the request.");
    } finally {
      await this.conn.disconnect();
    }
  };
}

export default OrdersDaoMongoDB;
