const bcrypt = require('bcrypt');
const User = require('../../../model/Users_db');
const InvariantError = require('../../Error/InvariantError');
const AuthenticationError = require('../../Error/AuthenticationError');
const NotFoundError = require('../../Error/NotFoundError');
const AuthorizationError = require('../../Error/AuthorizationError');

class UsersService {
  constructor() {
    this.db = User;
  }

  async checkRole() {
    const result = await this.db.find({ role: 'admin' });
    return result;
  }

  async addAdmin() {
    const admin = await this.checkRole();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('admin', salt);
    if (!admin.length) {
      await this.db.create({
        username: 'admin',
        phone_number: '081234567890',
        email: 'admin@gmail.com',
        password: hashPassword,
        role: 'admin',
      });
    }
  }

  async checkEmailExist(email) {
    const result = await this.db.find({ email });
    if (result.length) {
      throw new InvariantError('Email sudah digunakan');
    }
  }

  async addUser({ username, phoneNumber, email, password, confirmPassword }) {
    await this.checkEmailExist(email);

    if (password !== confirmPassword) {
      throw new InvariantError('Password dan confirmPassword tidak sesuai.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await this.db.create({
      username,
      phone_number: phoneNumber,
      email,
      password: hashPassword,
      role: 'user',
    });

    if (!result) {
      throw new InvariantError('Gagal membuat akun');
    }
    return result.id;
  }

  async getUsers() {
    const result = await this.db.find().select('-password');
    return result;
  }

  async verifyUserCredential(email, password) {
    const result = await this.db.findOne({ email });
    if (!result) {
      throw new AuthenticationError('Email tidak valid');
    }
    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      throw new AuthenticationError('Password tidak valid');
    }
    return result.id;
  }

  async verifyAdmin(userId) {
    const result = await this.db.findOne({ _id: userId });

    if (!result) {
      throw new NotFoundError('User tidak ditemukan');
    }
    const match = result.role === 'admin';
    if (!match) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = UsersService;
