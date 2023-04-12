class Quoter {
  static rates = {
    USD: 0.0058,
    BTC: 0.000059,
  };

  getPrice(price, coin) {
    switch (coin) {
      case "USD":
        return price * Quoter.rates["USD"];
      case "BTC":
        return price * Quoter.rates["BTC"];
      default:
        break;
    }
  }
}

export default Quoter;
