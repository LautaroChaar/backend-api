import { buildSchema } from 'graphql';

const GraphqlSchema = buildSchema(`

  type Producto {
    id: ID!
    timestamp: String,
    nombre: String,
    descripcion: String,
    codigo: Int,
    foto: String,
    precio: Int,
    stock: Int,
  }

  type Carrito {
    id: ID!
    timestamp: String,
    productos: [Producto]
  }

  type Usuario {
    id: ID!,
    name: String,
    lastname: String,
    adress: String,
    dateOfBirth: String,
    phone: Int,
    avatar: String,
    username: String,
    password: String
  }

  type Query {
    getAllProducts: [Producto],
    getProductById: Producto,
    getCartProducts: Carrito,
  }

  type Mutation {
    addProduct: Producto,
    updateProduct: Producto,
    deleteProduct: Producto,
    addToCart: Carrito,
    deleteCartProduct: Carrito
  }

`);

export default GraphqlSchema;