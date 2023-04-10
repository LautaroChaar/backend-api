class ProductoDTO {
    constructor(datos, cotizaciones) {
        this.id = datos.id;
        this.nombre = datos.nombre;
        this.categoria = datos.categoria;
        this.descripcion = datos.descripcion;
        this.foto = datos.foto;
        this.precio = datos.precio;
        this.stock = datos.stock;

        for (const [denominacion, valor] of Object.entries(cotizaciones)) {
            this[denominacion] = valor
        }
    }
}

export default ProductoDTO;