const request = require('request')
const zlib = require('zlib')
const tar = require('tar')

exports.downloadAndUnzip = function(url, dest) {
  return new Promise((resolve, reject) => {
    const onerror = (err) => {
      reject(err)
    }

    const gunzip = zlib.createGunzip()
    const extracter = tar.extract({ path: dest, strip: 1 })

    gunzip.on('error', onerror)
    extracter.on('error', onerror)
    extracter.on('end', resolve)
    request.get(url).on('error', onerror).pipe(gunzip).pipe(extracter)
  })
}