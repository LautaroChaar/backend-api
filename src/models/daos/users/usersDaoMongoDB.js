import mongoose from "mongoose";
import { config } from "../../../config/config.js";
import MongoDBContainer from "../../containers/mongoDBContainer.js";
import { usersModel } from "../../users.model.js";

class UsersDaoMongoDB extends MongoDBContainer {
  constructor() {
    super(usersModel);
  }

  getById = async (username) => {
    try {
      const strConn = config.atlas.strConn;
      await mongoose.connect(strConn);
      if ((await this.model.find({ username })) == false) {
        return false;
      } else {
        let res = await this.model.find({ username });
        return res[0];
      }
    } catch (error) {
      console.log(error);
      return { code: 500, msg: `Error completing the request.` };
    }
  };

  add = async (elem) => {
    try {
      const strConn = config.atlas.strConn;
      await mongoose.connect(strConn);
      const objs = await this.model.find();
      let id;
      if (objs.length === 0) {
        id = 1;
      } else {
        id = objs[objs.length - 1].id + 1;
      }
      const obj = { ...elem, id };
      await this.model.create(obj);
      return { msg: `Added!` };
    } catch (error) {
      return { code: 500, msg: `Failed to add.` };
    }
  };
}

export default UsersDaoMongoDB;
