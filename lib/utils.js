const _ = require('lodash');

module.exports = {
  noop: () => {},
  formatMsg2Str,
};

/**
 * 格式化数据
 */
function formatMsg2Str(resultArr) {
  let stringMsg = {
    content: [],
    isUpdate: false,
  }

  resultArr.sort((msg1, msg2) => msg2.date - msg1.date)
  stringMsg.content = stringMsg.content.concat(_.map(resultArr, (rss) => rss.content));

  return stringMsg;
}