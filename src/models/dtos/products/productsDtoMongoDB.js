class ProductDTO {
  constructor(data, quotes) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.image = data.image;
    this.price = data.price;
    this.stock = data.stock;

    for (const [key, value] of Object.entries(quotes)) {
      this[key] = value;
    }
  }
}

export default ProductDTO;
