const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../Error/InvariantError');
const AuthenticationError = require('../../Error/AuthenticationError');
const NotFoundError = require('../../Error/NotFoundError');
const AuthorizationError = require('../../Error/AuthorizationError');

class UsersService {
  constructor() {
    this.pool = new Pool();
  }

  async checkRole() {
    const result = await this.pool.query({
      text: "SELECT * FROM users WHERE role='admin'",
    });
    return result.rows;
  }

  async addAdmin() {
    const id = `admin-${nanoid(30)}`;
    const createdAt = new Date().toISOString();
    const admin = await this.checkRole();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('admin', salt);
    if (!admin.length) {
      await this.pool.query({
        text: 'INSERT INTO users (id,username,phone_number,email,password,role,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$7)',
        values: [id, 'admin', '081234567890', 'admin@gmail.com', hashPassword, 'admin', createdAt],
      });
    }
  }

  async checkEmailExist(email) {
    const result = await this.pool.query({
      text: 'SELECT * FROM users WHERE email=$1 ',
      values: [email],
    });

    if (result.rows.length) {
      throw new InvariantError('Email sudah digunakan');
    }
  }

  async addUser({ username, phoneNumber, email, password }) {
    await this.checkEmailExist(email);
    const id = `user-${nanoid(30)}`;
    const createdAt = new Date().toISOString();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await this.pool.query({
      text: 'INSERT INTO users (id,username,phone_number,email,password,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$6) RETURNING id',
      values: [id, username, phoneNumber, email, hashPassword, createdAt],
    });
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user');
    }
    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const result = await this.pool.query({
      text: 'SELECT id,password FROM users WHERE username=$1',
      values: [username],
    });
    if (!result.rows.length) {
      throw new AuthenticationError('Username tidak valid');
    }
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) {
      throw new AuthenticationError('Password tidak valid');
    }
    return result.rows[0].id;
  }

  async verifyAdmin(userId) {
    const result = await this.pool.query({
      text: 'SELECT * FROM users WHERE id=$1',
      values: [userId],
    });

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    const match = result.rows[0].role === 'admin';
    if (!match) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = UsersService;
