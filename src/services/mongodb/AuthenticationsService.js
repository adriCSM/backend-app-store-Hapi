const Authentication = require('../../../model/Authentications_db');
const InvariantError = require('../../Error/InvariantError');

class AuthenticationsService {
  constructor() {
    this.db = Authentication;
  }

  async checkRefreshTokenExistAndDelete(userId) {
    const result = await this.db.find({ user_id: userId });
    if (result.length) {
      await this.db.deleteOne({
        user_id: userId,
      });
    }
  }

  async addRefreshToken(userId, refreshToken) {
    await this.checkRefreshTokenExistAndDelete(userId);
    await this.db.create({
      user_id: userId,
      token: refreshToken,
    });
  }

  async verifyRefreshToken(refreshToken) {
    const result = await this.db.find({
      token: refreshToken,
    });
    if (!result.length) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this.db.deleteMany({
      token: refreshToken,
    });
  }
}

module.exports = AuthenticationsService;
