const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      socket: {
        port: 6379,
        host: '127.0.0.1',
      },
    });
    // url: process.env.REDIS_URL,

    this.client.on('error', (error) => {
      console.log(` Redis client error:${error}`);
    });

    this.client.connect();
  }

  async set(key, value, expiredIn = 1800) {
    await this.client.set(key, value, {
      EX: expiredIn,
    });
  }

  async get(key) {
    const result = await this.client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  delete(key) {
    this.client.del(key);
  }
}
module.exports = CacheService;
