const r2 = require('r2');
const utils = require('../utils');

module.exports = class R2 {
  constructor(options) {
    this._handle = options.handle || utils.noop;
  }
  async fetch(url, done) {
    let res = await r2(url).response;
    this._handle(null, res.body, done || utils.noop);
  }
}