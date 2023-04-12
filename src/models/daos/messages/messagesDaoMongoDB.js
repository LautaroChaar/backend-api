import { logger } from "../../../config/configLogger.js";
import MongoDBContainer from "../../containers/mongoDBContainer.js";
import { messagesModel } from "../../messages.model.js";

class MessagesDaoMongoDB extends MongoDBContainer {
  constructor() {
    super(messagesModel);
  }

  getByEmail = async (username) => {
    try {
      await this.conn.connect();
      console.log(username);
      if ((await this.model.find({ "user.email": username })) == false) {
        throw new CustomError(404, "Get by category", "Element not found.");
      } else {
        let res = await this.model.find({ "user.email": username });
        console.log(res);
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

export default MessagesDaoMongoDB;
