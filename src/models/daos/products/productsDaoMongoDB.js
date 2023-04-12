import MongoDBContainer from "../../containers/mongoDBContainer.js";
import { productsModel } from "../../products.model.js";

class ProductsDaoMongoDB extends MongoDBContainer {
  constructor() {
    super(productsModel);
  }

  getByCategory = async (category) => {
    try {
      await this.conn.connect();
      if ((await this.model.find({ category })) == false) {
        throw new CustomError(404, "Get by category", "Element not found.");
      } else {
        let res = await this.model.find({ category });
        return res;
      }
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        500,
        "Get by category",
        "Error completing the request."
      );
    } finally {
      await this.conn.disconnect();
    }
  };
}

export default ProductsDaoMongoDB;
