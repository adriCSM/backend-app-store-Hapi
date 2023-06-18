const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../Error/InvariantError');
const NotFoundError = require('../../Error/NotFoundError');

class UsersService {
  constructor() {
    this.pool = new Pool();
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
      throw new NotFoundError('Username tidak ditemukan');
    }
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) {
      throw new InvariantError('Password salah');
    }
    return result.rows[0].id;
  }
}

module.exports = UsersService;
