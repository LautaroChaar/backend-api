import CustomError from "./CustomError.class.js";

class DBClient {
  async connect() {
    throw new CustomError(500, "Missing implement 'connect' in Sub Class");
  }

  async disconnect() {
    throw new CustomError(500, "Missing implement 'disconnect' in Sub Class");
  }
}

export default DBClient;
