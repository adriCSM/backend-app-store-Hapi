const { Pool } = require('pg');

class CartsService {
  constructor() {
    this.pool = new Pool();
  }
}

module.exports = CartsService;
