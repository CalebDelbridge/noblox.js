// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['assetId', 'userAssetId', 'price']
exports.optional = ['jar']

// Docs
/**
 * Marks an asset as resellable.
 * @category Asset
 * @alias setRank
 * @param {number} assetId - The id of the asset.
 * @param {number} userAssetId - The id of the asset in users inventory.
 * @param {number} price - The price you want to resell the asset at.
 * @returns {Promise<Boolean>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.markAsResellable(187483689, 187483689, 100)
**/

// Define
function markAsResellable (jar, xcsrf, assetId, userAssetId, price) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//economy.roblox.com/v1/assets/${assetId}/resellable-copies/${userAssetId}`,
      options: {
        resolveWithFullResponse: true,
        method: 'PATCH',
        jar: jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': xcsrf
        },
        body: JSON.stringify({
          price: price
        })
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return markAsResellable(jar, xcsrf, args.assetId, args.userAssetId, args.price)
    })
}

exports.func = function (args) {
  return runWithToken(args)
}
