const Product = require('../../../model/Products_db');
const InvariantError = require('../../Error/InvariantError');
const NotFoundError = require('../../Error/NotFoundError');

class ProductsService {
  constructor(firebaseService, cacheService) {
    this.db = Product;
    this.firebaseService = firebaseService;
    this.cacheService = cacheService;
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
    const result = await this.db.find({
      name: productName,
    });
    if (result.length) {
      throw new InvariantError('Nama product sudah ada. Gunakan nama lain');
    }
  }

  async addProduct(productName, price, image) {
    await this.checkNameProductExist(productName);
    const result = await this.db.create({
      name: productName,
      price,
      image,
    });
    if (!result) {
      throw new InvariantError('Product gagal ditambahkan');
    }
    await this.cacheService.delete('allProduct');

    return result.id;
  }

  async getProducts() {
    try {
      const result = await this.cacheService.get('allProduct');
      return { result: JSON.parse(result), cache: true };
    } catch (error) {
      const result = await this.db.find().select('-__v');
      await this.cacheService.set('allProduct', JSON.stringify(result));
      return { result, cache: false };
    }
  }

  async getProduct(id) {
    const result = await this.db.findOne({ _id: id });
    if (!result) {
      throw new NotFoundError('Product tidak ditemukan');
    }
    return result;
  }

  async putProduct(id, payload) {
    const { productName, price } = payload;
    const rows = await this.getProduct(id);
    const oldName = rows.name.split(' ').join('_');
    await this.firebaseService.deleteImage(oldName);

    const url = await this.uploadProductImageInFirebase(payload);
    const result = await this.db.findOneAndUpdate(
      { _id: id },
      {
        name: productName,
        price,
        image: url,
      },
    );
    if (!result) {
      throw new InvariantError('Product gagal diperbarui');
    }
    await this.cacheService.delete('allProduct');
    return result.id;
  }

  async deleteProduct(id) {
    const result = await this.db.findOneAndDelete({ _id: id });
    if (!result) {
      throw new InvariantError('Product gagal dihapus');
    }
    const newName = result.name.split(' ').join('_');
    await this.cacheService.delete('allProduct');
    await this.firebaseService.deleteImage(newName);
  }
}

module.exports = ProductsService;
