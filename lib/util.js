const fs = require('fs')
const zlib = require('zlib')
const request = require('request')
const tar = require('tar')

exports.downloadAndUnzip = function(url, dest) {

  return new Promise((resolve, reject) => {

    request.get(url)
      .on('error', reject)
      .pipe(zlib.createGunzip())
      .on('error', reject)
      .pipe(
        tar.extract({
          strip: 1,
          cwd: dest
        })
      )
      .on('error', reject)
      .on('end', resolve)
  })
}

/**
 * 是否是空目录
 */
exports.isEmptyDir = (dest) => {
  return !fs.existsSync(dest) || (fs.statSync(dest).isDirectory() && !fs.readdirSync(dest).length)
}