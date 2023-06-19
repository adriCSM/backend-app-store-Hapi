const { Pool } = require('pg');
const InvariantError = require('../../Error/InvariantError');

class CartsService {
  constructor() {
    this.pool = new Pool();
  }

  async addToCart(userId, productId) {
    const result = await this.pool.query({
      text: 'INSERT INTO carts (user_id,product_id) VALUES ($1,$2) RETURNING product_id',
      values: [userId, productId],
    });
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan product ke keranjang');
    }
  }

  async getProductsInCart(userId) {
    const result = await this.pool.query({
      text: 'SELECT products.* FROM carts LEFT JOIN products ON products.id=carts.product_id WHERE user_id=$1 ',
      values: [userId],
    });
    return result.rows;
  }

  async beforeLook(userId) {
    const result = await this.pool.query({
      text: 'SELECT * FROM carts WHERE user_id=$1 AND look=$2',
      values: [userId, false],
    });

    return result.rowCount;
  }

  async lookCart(userId) {
    await this.pool.query({
      text: 'UPDATE carts SET look=$1 WHERE user_id=$2 ',
      values: [true, userId],
    });
  }

  async deleteProductInCart(productId) {
    const result = await this.pool.query({
      text: 'DELETE FROM carts WHERE product_id=$1 RETURNING product_id',
      values: [productId],
    });
    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus product pada keranjang');
    }
  }
}

module.exports = CartsService;
