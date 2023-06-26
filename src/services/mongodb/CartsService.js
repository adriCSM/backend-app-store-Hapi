const Cart = require('../../../model/Carts_db');
const InvariantError = require('../../Error/InvariantError');

class CartsService {
  constructor() {
    this.db = Cart;
  }

  async cekProductCartExist(userId, productId) {
    const result = await this.db.find({
      user_id: userId,
      product_id: productId,
    });

    return result.length;
  }

  async addToCart(userId, productId, count) {
    const rows = await this.cekProductCartExist(userId, productId);
    if (rows) {
      const result = await this.db.findOneAndUpdate(
        { user_id: userId, product_id: productId },
        {
          $inc: { count },
        },
      );
      if (!result) {
        throw new InvariantError('Gagal menambahkan product ke keranjang');
      }
    } else {
      const result = await this.db.create({
        user_id: userId,
        product_id: productId,
        count,
      });
      if (!result) {
        throw new InvariantError('Gagal menambahkan product ke keranjang');
      }
    }
  }

  async getProductsInCart(userId) {
    const result = await this.db
      .find({
        user_id: userId,
      })
      .populate({ path: 'product_id', select: 'image name price' })
      .select('-_id -__v -user_id');

    return result;
  }

  async deleteProductInCart(userId, productId) {
    const result = await this.db.findOneAndDelete({
      user_id: userId,
      product_id: productId,
    });
    if (!result) {
      throw new InvariantError('Gagal menghapus product pada keranjang');
    }
  }
}

module.exports = CartsService;
