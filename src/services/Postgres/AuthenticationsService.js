const { Pool } = require('pg');
const InvariantError = require('../../Error/InvariantError');

class AuthenticationsService {
  constructor() {
    this.pool = new Pool();
  }

  async checkRefreshTokenExistAndDelete(userId) {
    const result = await this.pool.query({
      text: 'SELECT * FROM authentications WHERE user_id=$1 ',
      values: [userId],
    });
    if (result.rows.length) {
      await this.pool.query({
        text: 'DELETE FROM authentications WHERE user_id=$1 ',
        values: [userId],
      });
    }
  }

  async addRefreshToken(userId, refreshToken) {
    await this.checkRefreshTokenExistAndDelete(userId);
    await this.pool.query({
      text: 'INSERT INTO authentications (user_id,token) VALUES ($1,$2) ',
      values: [userId, refreshToken],
    });
  }

  async verifyRefreshToken(userId, refreshToken) {
    const result = await this.pool.query({
      text: 'SELECT * FROM authentications WHERE user_id=$1 AND token=$2 ',
      values: [userId, refreshToken],
    });

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }

  async deleteRefreshToken(userId, refreshToken) {
    await this.pool.query({
      text: 'DELETE FROM authentications WHERE user_id=$1 AND token=$2',
      values: [userId, refreshToken],
    });
  }
}

module.exports = AuthenticationsService;
