const fs = require('fs-extra');
const path = require('path');

/**
 * 所有的文件操作均采用同步操作，防止文件被多人同时修改
 */

function save(filePath, content) {
  outputStr = ""
  outputStr = content.reduce((a, b) => a + b, '');

  fs.ensureFileSync(filePath);
  fs.appendFileSync(filePath, outputStr);
}


// 这里更新的操作，有待优化，若是写入的多了，就会出问题，可以好好写写文件存储
// 若是不采用临时文件，直接写入，则又涉及文件内容寻址的问题，可以来一个寻址的缓存文件。。。
function update(filePath, content) {
  outputStr = ""
  outputStr = content.reduce((a, b) => a + b, ''); 
  dir = path.filePathname(filePath);

  tmpFilePath = path.join(dir, '/tmp.txt')

  fs.ensureFileSync(filePath)
  fs.ensureFileSync(tmpFilePath)
  oldMsg = fs.readFileSync(filePath)
  fs.appendFileSync(tmpFilePath, outputContent)
  fs.appendFileSync(tmpFilePath, oldMsg)
  fs.removeSync(filePath)
  fs.rename(tmpFilePath, filePath) 
}

module.exports = {
  save,
  update,
};