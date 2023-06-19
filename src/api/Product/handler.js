class ProductHandler {
  constructor(productsService, usersService, validator) {
    this.productService = productsService;
    this.usersService = usersService;
    this.validator = validator;
  }

  async postProductHandler(request, h) {
    const { image } = request.payload;
    const { id } = request.auth.credentials;
    await this.usersService.verifyAdmin(id);
    this.validator.validateImageHeaders(image.hapi.headers);
    this.validator.validatePostProductPayload(request.payload);
    const url = await this.productService.uploadProductImageInFirebase(request.payload);
    const { productName, price } = request.payload;
    const productId = await this.productService.addProduct(productName, price, url);
    const response = h
      .response({
        status: 'success',
        message: 'Product berhasil di tambahkan',
        data: {
          productId,
        },
      })
      .code(201);
    return response;
  }

  async getAllProductHandler(request, h) {
    const products = await this.productService.getProducts();
    const response = h
      .response({
        status: 'success',
        data: {
          products,
        },
      })
      .code(200);
    return response;
  }

  async getProductHandler(request, h) {
    const { id } = request.params;
    const product = await this.productService.getProduct(id);
    return h
      .response({
        status: 'success',
        data: {
          product,
        },
      })
      .code(200);
  }

  async putProductHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    await this.usersService.verifyAdmin(userId);
    this.validator.validatePuttProductPayload(request.payload);
    const { image } = request.payload;
    this.validator.validateImageHeaders(image.hapi.headers);
    const { id } = request.params;
    await this.productService.putProduct(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Product berhasil diperbarui',
    });
  }

  async deleteProductHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    await this.usersService.verifyAdmin(userId);
    const { id } = request.params;
    await this.productService.deleteProduct(id);
    return h.response({
      status: 'success',
      message: 'Product berhasil dihapus',
    });
  }
}

module.exports = ProductHandler;
