import { carritosDao as apiCarrito } from '../service/index.js';
import { productosDao as apiProductos } from '../service/index.js';

export async function getAllProducts(req, res) {
    try {
        const DB_PRODUCTS = await apiProductos.getAll();
        res.render('viewProds', {DB_PRODUCTS}); 
    } catch (error) {
        console.log(error);
    }
}; 

export async function getProductById(req, res) {
    try {
        const DB_PRODUCTS = [await apiProductos.getById(req.params.id)];
        res.render('viewProds', {DB_PRODUCTS});
    } catch (error) {
        console.log(error);
    }
}; 

export async function addProduct(req, res) {
    try {
        const {nombre, precio, descripcion, stock, codigo, foto} = req.body;
        const datos = {nombre, precio, descripcion, stock, codigo, foto};
        await apiProductos.add(datos);
        res.redirect('/api/graphql');
    } catch (error) {
        console.log(error);
    }
}; 

export async function updateProduct(req, res) {
    try {
        const {nombre, precio, descripcion, stock, codigo, foto} = req.body;
        const id = Number(req.body.idProd);
        const datos = {id, nombre, precio, descripcion, stock, codigo, foto};
        
        Object.filter = (obj, filtro) => 
        Object.keys(obj)
              .filter( key => filtro(obj[key]))
              .reduce( (res, key) => (res[key] = obj[key], res), {});
        const nuevosDatos = Object.filter(datos, (e) => e !== "");
        await apiProductos.update(nuevosDatos);
        res.redirect('/api/graphql');
    } catch (error) {
        console.log(error);
    }
}; 

export async function deleteProduct(req, res) {
    try {
        const id = Number(req.body.idProd);
        await apiProductos.deleteById(id);
        res.redirect('/api/graphql');
    } catch (error) {
        console.log(error);
    }
}; 

export async function getCartProducts(req, res) {
    try {
        const carrito = await apiCarrito.getById(req.user.id);
        res.render('viewCart', {carrito});
    } catch (error) {
        console.log(error);
    }
}; 

export async function addToCart (req, res) {
    try {
        const id = Number(req.body.idProd);
        const carrito = await apiCarrito.getById(req.user.id);
        const producto = await apiProductos.getById(id);
        carrito.productos.push(producto);
        const elem = {...carrito, id: Number(req.user.id)};
        await apiCarrito.update(elem);
        res.redirect('/api/graphql');
    } catch (error) {
        console.log(error);
    }
}; 

export async function deleteCartProduct (req, res) {
    try {
        const carrito = await apiCarrito.getById(req.user.id);
        const id = Number(req.body.idProd);
        const index = carrito.productos.findIndex( p => p.id == id);
        if (index != -1 ) {
            carrito.productos.splice(index, 1);
            const elem = {...carrito, id: Number(req.user.id)};
            await apiCarrito.update(elem);
            res.redirect('/api/graphql');
        }
    } catch (error) {
        console.log(error);
    }
};

export async function viewGraphql (req, res) {
    const DB_PRODUCTS = await apiProductos.getAll();
    res.render('viewGraphql', {DB_PRODUCTS});
};

