import ContenedorMongoDB from "../../containers/contenedorMongoDB.js";
import { ordenesModel } from "../../ordenes.model.js";

class OrdenesDaoMongoDB extends ContenedorMongoDB {
   constructor() {
      super(ordenesModel);
   }

   add = async (elem) => {
      try {
          const timestamp = new Date().toLocaleString();
          await this.conn.connect(); 
          const objs = await this.model.find();
          let numeroOrden;
          if (objs.length === 0) {
            numeroOrden = 1;
          } else {
            numeroOrden = objs[objs.length - 1].numeroDeOrden + 1;
          }
          const obj =  { ...elem, timestamp, numeroDeOrden:numeroOrden };
          await this.model.create(obj);
          return (obj);
      } catch (error) {
          logger.error(error);
          throw new CustomError(500, 'Add', 'Error al agregar elemento.');
      }  finally {
          await this.conn.disconnect();
      }
  }

  getById = async (id) => {
   try {
       await this.conn.connect();
       if (await this.model.find({id: id}) == false) {
           throw new CustomError(404, 'Get by id', 'Elemento no encontrado.');
       } else {
           let res = await this.model.find({id: id});
           return res;
       }
   } catch (error) {
       logger.error(error);
       throw new CustomError(500, 'Get by id', 'Error al completar la solicitud.');
   } finally {
       await this.conn.disconnect();
   }
}

}

export default OrdenesDaoMongoDB;