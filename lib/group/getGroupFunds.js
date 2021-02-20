// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']

// Docs
/**
 * Get the amount of funds a group has available.
 * @category Group
 * @alias getGroupFunds
 * @param {number} group - The id of the group.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const amountOfRobux = await noblox.getCurrency(1)
**/

function getGroupFunds (jar, xcsrf, group) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//economy.roblox.com/v1/groups/${group}/currency`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body).robux)
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${res.body}`))
          }
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar }).then(function (xcsrf) {
    return getGroupFunds(jar, xcsrf, args.group)
  })
}
