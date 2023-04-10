import ContenedorMongoDB from "../../containers/contenedorMongoDB.js";
import { productosModel } from "../../../models/productos.model.js";

class ProductosDaoMongoDB extends ContenedorMongoDB {
   constructor() {
      super(productosModel);
   }

   getByCategory = async (category) => {
      try {
          await this.conn.connect();
          if (await this.model.find({categoria: category}) == false) {
              throw new CustomError(404, 'Get by category', 'Elemento no encontrado.');
          } else {
              let res = await this.model.find({categoria: category});
              return res;
          }
      } catch (error) {
          logger.error(error);
          throw new CustomError(500, 'Get by category', 'Error al completar la solicitud.');
      } finally {
          await this.conn.disconnect();
      }
  }
  
}

export default ProductosDaoMongoDB;