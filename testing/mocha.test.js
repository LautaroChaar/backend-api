import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';


describe('test api rest full', () => {

    before( function () {
        console.log('Comienzo de prueba');
    })

    after(function () {
        console.log('Final de prueba');
    })

    describe('GET', () => {
        it('debería retornar la lista de productos', async () => {
            const response = await request(app).get('/api/productos/');
            console.log(response.body)
            expect(response.status);
        })
    })

    describe('POST', () => {
        it('debería incorporar un producto', async () => {
            const prod = {
                nombre: "Pantalon",
                descripcion: "Pantalon de jean negro",
                precio: 15000,
                codigo: 465,
                stock: 20,
                foto: " "
            };
            const response = await request(app).post('/api/productos/').send(prod);
            expect(response.status).to.eql(200);
            const producto = response.body;
            expect(producto).to.include.keys('nombre', 'descripcion', 'precio', 'codigo', 'stock', 'foto');
            expect(producto.nombre).to.eql(prod.nombre);
            expect(producto.descripcion).to.eql(prod.descripcion);
            expect(producto.precio).to.eql(prod.precio);
            expect(producto.codigo).to.eql(prod.codigo);
            expect(producto.stock).to.eql(prod.stock);
            expect(producto.foto).to.eql(prod.foto);
        })
        })

    describe('PUT', () => {
        it('debería actualizar un producto', async () => {
            const prod = {
                codigo: 800,
                precio: 20000,
                foto: "https://sendeyo.com/updownload/file/script/136448cba4daaa2e2387b10e1e68ee3c.webp"
            };
            const response = await request(app).put('/api/productos/1').send(prod);
            expect(response.status).to.eql(200);

            const producto = response.body;
            expect(producto.precio).to.eql(prod.precio);
            expect(producto.codigo).to.eql(prod.codigo);
            expect(producto.foto).to.eql(prod.foto);
        })
    })

    describe('DELETE', () => {
        it('debería eliminar un producto', async () => {
            const response = await request(app).delete('/api/productos/3');
            expect(response.status).to.eql(202);
        })
    })


})


