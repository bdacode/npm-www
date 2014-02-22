// slightly less stupid download counts
// The download API is in /npm/download-counts.
// If the downloads API isn't running, you get nothing, and we display nothing.

module.exports = downloads

var AC = require('async-cache')
var hh = require('http-https')
var parse = require('parse-json-response')

var cache = new AC({
  max: 1000,
  maxAge: 1000 * 60 * 60,
  load: load
})

var config = require('../config.js')
var qs = require('querystring')

function downloads (period, pkg, cb) {

  // pkg is optional
  if (typeof cb !== 'function')
    cb = pkg, pkg = null

  var k = JSON.stringify([period, pkg])
  cache.get(k, cb)
}

function load (k, cb) {
  k = JSON.parse(k)
  var period = k[0]
  var pkg = k[1]

  var url = config.downloads.url + "point/" + period
  if (pkg) url += "/" + pkg

  hh.get(url, parse(function(er, data, res) {
    if (er) {
      console.warn('Fetching download failed', res.headers, er)
      cb(null,0)
    }
    else {
      cb(null,data.downloads||0)
    }
  }))

}
