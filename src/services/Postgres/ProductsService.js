const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../Error/InvariantError');
const NotFoundError = require('../../Error/NotFoundError');

class ProductsService {
  constructor(firebaseService) {
    this.pool = new Pool();
    this.firebaseService = firebaseService;
  }

  async uploadProductImageInFirebase(payload) {
    const { productName } = payload;
    const newName = productName.split(' ').join('_');
    const fileBuffer = payload.image._data;
    const metadata = {
      contentType: payload.image.hapi.headers['content-type'],
    };
    const url = await this.firebaseService.addImage(newName, fileBuffer, metadata);
    return url;
  }

  async checkNameProductExist(productName) {
    const result = await this.pool.query({
      text: 'SELECT * FROM products WHERE name=$1',
      values: [productName],
    });
    if (result.rows.length) {
      throw new InvariantError('Product name sudah ada. Gunakan nama lain');
    }
  }

  async addProduct(productName, price, image) {
    await this.checkNameProductExist(productName);
    const id = `product-${nanoid(15)}`;
    const result = await this.pool.query({
      text: 'INSERT INTO products (id,name,price,image) VALUES ($1,$2,$3,$4) RETURNING id',
      values: [id, productName, price, image],
    });

    if (!result.rows.length) {
      throw new InvariantError('Product gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getProducts() {
    const result = await this.pool.query({
      text: 'SELECT * FROM products',
    });

    return result.rows;
  }

  async getProduct(id) {
    const result = await this.pool.query({
      text: 'SELECT * FROM products WHERE id=$1',
      values: [id],
    });
    if (!result.rows.length) {
      throw new NotFoundError('Product tidak ditemukan');
    }
    return result.rows[0];
  }

  async putProduct(id, payload) {
    const rows = await this.getProduct(id);
    const newName = rows.name.split(' ').join('_');
    await this.firebaseService.deleteImage(newName);
    const { productName, price, image } = payload;
    await this.checkNameProductExist(productName);

    if (typeof image === 'string') {
      const result = await this.pool.query({
        text: 'UPDATE products SET name=$2,price=$3,image=$4 WHERE id=$1 RETURNING id',
        values: [id, productName, price, image],
      });
      if (!result.rows.length) {
        throw new InvariantError('Product gagal diperbarui');
      }
      return result.rows[0].id;
    }

    const url = await this.uploadProductImageInFirebase(payload);
    const result = await this.pool.query({
      text: 'UPDATE products SET name=$2,price=$3,image=$4 WHERE id=$1 RETURNING id',
      values: [id, productName, price, url],
    });
    if (!result.rows.length) {
      throw new InvariantError('Product gagal diperbarui');
    }
    return result.rows[0].id;
  }

  async deleteProduct(id) {
    const rows = await this.getProduct(id);
    const result = await this.pool.query({
      text: 'DELETE FROM products WHERE id=$1 RETURNING image',
      values: [id],
    });

    if (!result.rows.length) {
      throw new InvariantError('Product gagal dihapus');
    }
    const newName = rows.name.split(' ').join('_');

    await this.firebaseService.deleteImage(newName);
  }
}

module.exports = ProductsService;
