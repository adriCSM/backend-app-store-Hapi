class CartHandler {
  constructor(cartsService, validator) {
    this.cartsService = cartsService;
    this.validator = validator;
  }

  async postCartHandler(request, h) {
    const { id: productId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this.cartsService.addToCart(userId, productId);
    return h
      .response({
        status: 'success',
        message: 'Product ditambahkan ke keranjang',
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

  async getCountCartNotLookHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const count = await this.cartsService.beforeLook(userId);
    return h.response({
      status: 'success',
      data: {
        count,
      },
    });
  }

  async putCartHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    await this.cartsService.lookCart(userId);
    return h.response({
      status: 'success',
      message: 'Keranjang dilihat',
    });
  }

  async deleteProductInCartHandler(request, h) {
    const { id: productId } = request.params;
    await this.cartsService.deleteProductInCart(productId);
    return h.response({
      status: 'success',
      message: 'Berhasil menghapus product pada keranjang',
    });
  }
}

module.exports = CartHandler;
