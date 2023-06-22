const { Pool } = require('pg');
const InvariantError = require('../../Error/InvariantError');

class CartsService {
  constructor() {
    this.pool = new Pool();
  }

  async cekProductCartExist(productId) {
    const result = await this.pool.query({
      text: 'SELECT * FROM carts WHERE product_id=$1',
      values: [productId],
    });

    return result.rows.length;
  }

  async addToCart(userId, productId, count) {
    const rows = await this.cekProductCartExist(productId);
    if (rows) {
      const result = await this.pool.query({
        text: 'UPDATE carts SET count=count+$3 WHERE user_id=$1 AND product_id=$2 RETURNING product_id',
        values: [userId, productId, count],
      });
      if (!result.rows.length) {
        throw new InvariantError('Gagal menambahkan product ke keranjang');
      }
    } else {
      const result = await this.pool.query({
        text: 'INSERT INTO carts (user_id,product_id,count) VALUES ($1,$2,$3) RETURNING product_id',
        values: [userId, productId, count],
      });
      if (!result.rows.length) {
        throw new InvariantError('Gagal menambahkan product ke keranjang');
      }
    }
  }

  async getProductsInCart(userId) {
    const result = await this.pool.query({
      text: 'SELECT products.*,carts.count FROM carts LEFT JOIN products ON products.id=carts.product_id WHERE user_id=$1 ',
      values: [userId],
    });
    return result.rows;
  }

  async updateCount(userId, productId, count) {
    const result = await this.pool.query({
      text: 'UPDATE carts SET count=$3 WHERE user_id=$1 AND product_id=$2 RETURNING product_id',
      values: [userId, productId, count],
    });
    if (!result.rows.length) {
      throw new InvariantError('Gagal memperbarui jumlah product pada keranjang');
    }
  }

  async deleteProductInCart(userId, productId) {
    const result = await this.pool.query({
      text: 'DELETE FROM carts WHERE user_id=$1 AND product_id=$2 RETURNING product_id',
      values: [userId, productId],
    });
    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus product pada keranjang');
    }
  }
}

module.exports = CartsService;
