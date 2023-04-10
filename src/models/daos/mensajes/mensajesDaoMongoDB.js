import ContenedorMongoDB from "../../containers/contenedorMongoDB.js";
import { mensajesModel } from "../../../models/mensajes.model.js";

class MensajesDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super(mensajesModel);
    }

    getByEmail = async (username) => {
        try {
            await this.conn.connect();
            console.log(username)
            if (await this.model.find({'usuario.email': username}) == false) {
                throw new CustomError(404, 'Get by category', 'Elemento no encontrado.');
            } else {
                let res = await this.model.find({'usuario.email': username});
                console.log(res)
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

export default MensajesDaoMongoDB;