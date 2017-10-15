const crawler = require('../crawler');
const Parser = require('../parser');

const DefaultOptions = {
  crawler: {
    maxConnections: 10,
    // 设置以获取原始数据
    encoding: 'string',
    jQuery:false,
  }  
}

module.exports = class Minder {
  constructor(options) {
    options = options || {};

    this._crawler = new crawler[options.crawler || 'r2']({
      handle: this._handle.bind(this)
    });
    this._url = options.url;
  }
  fetch(url) {
    this._url = url ? url : this._url;
    this._crawler.fetch(url || this._url);
  }
  _handle(err, res, done) {
    this._parser = new Parser({
      res,
    });
    this._setEventListener(this._parser, done);
  }
  _setEventListener(parser, done) {
    const self = this;
    parser.on('data', (data) => {
    });
    parser.on('end', () => {
      // self.fetch()
      done();
    });
  }
}