const zlib = require('zlib')
const request = require('request')
const tar = require('tar')

exports.downloadAndUnzip = function(url, dest) {

  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip()

    gunzip.on('error', reject)

    request.get(url)
    .on('error', reject)
    .pipe(gunzip)
    .pipe(
      tar.extract({
        strip: 1,
        cwd: dest
      })
    )
    .on('end', resolve)
    .on('error', reject)
  })
}