class CartHandler {
  constructor(cartsService, validator) {
    this.cartsService = cartsService;
    this.validator = validator;
  }

  async postCartHandler(request, h) {
    const { id: productId, count } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.cartsService.addToCart(userId, productId, count);
    return h
      .response({
        status: 'success',
        message: 'Product ditambahkan ke keranjang',
      })
      .code(201);
  }

  async putCountProductOnCartHandler(request, h) {
    const { id: productId, count } = request.payload;
    const { id: userId } = request.auth.credentials;
    await this.cartsService.updateCount(userId, productId, count);
    return h
      .response({
        status: 'success',
        message: 'Jumlah product berhasil diperbarui',
      })
      .code(201);
  }

  async getProductsInCartHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const products = await this.cartsService.getProductsInCart(userId);
    return h.response({
      status: 'success',
      data: {
        products,
      },
    });
  }

  async deleteProductInCartHandler(request, h) {
    const { id: productId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this.cartsService.deleteProductInCart(userId, productId);
    return h.response({
      status: 'success',
      message: 'Berhasil menghapus product pada keranjang',
    });
  }
}

module.exports = CartHandler;
