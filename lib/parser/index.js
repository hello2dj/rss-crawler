const ee = require('events').EventEmitter;
const FeedParser = require('feedparser');
const moment = require('moment');
const path = require('path');

const Store = require('../store');
const utils = require('../utils');

const DefaultOtions = {
  store: Store.FS,
  isStore: true,
}

const EVENTS_NAME = {
  'DATA': 'data',
}

module.exports = class Parser extends ee {
  constructor(options) {
    super();
    options = Object.assign({}, DefaultOtions, options);
    // 默认持久化
    options.isStore ? this._store = (Store[options.store || Store.FS]) : null;

    // 初始化
    this.init(options); 
    // 启动
    this.start();
  }
  init(options) {
    // 默认的feedParesr
    this._feedParser = options.parser || new FeedParser();
    this._res = options.res;
    this._listenersMap = {};
    this._result = [];
    this._init = true;
    this._formatItem2Str.bind(this); 
  }
  start() {
    this._res.pipe(this._feedParser);
    this.setEventHandle();
  }
  setEventHandle() {
    const self = this;
    this._feedParser.on('error', function (error) {
      console.log('parser error ', error.message || error);
    });

    this._feedParser.on('readable', function () {
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      while (item = stream.read()) {
        self.emit(EVENTS_NAME.DATA, item);
        self._formatItem2Str(item);
      }
    });
    this._feedParser.on('end', () => {
      self._handleEnd();
    });
  }
  _formatItem2Str(item) {
    // 记录最近一次的更新
    this.lastUpdate = !this.lastUpdate ? moment(item.date) : null;
    this.lastUpdate = this.lastUpdate - moment(item.date) > 0 ? this.lastUpdate : moment(item.date);

    this._result.push({
      date: moment(item.date),
      content: `${moment(item.date).format('YYYY-MM-DD h:mm:ss')}\n${item.title}\n${item.description}\n\n`
    });
  }
  _handleEnd() {
    this._finalResult = utils.formatMsg2Str(this._result);

    if (!this._store) return;
    this._init ? this._store.save(path.join('data/rss.txt'), this._finalResult.content) : this._store.update(path.join('data/rss.txt'), this._finalResult.content);
    this._init ? this._init = false : null;

    this.emit('end');
  }
  setStore(store) {
  }
}