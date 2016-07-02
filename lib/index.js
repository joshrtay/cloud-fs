/**
 * Modules
 */

const Emitter = require('events')
const fs = require('fs')
const {extname, basename, resolve, dirname, join} = require('path')
const farmhash = require('farmhash')
const stackTrace = require('stack-trace')


/**
 * Vars
 */


const BASE = process.env.CLOUD_FS || '/assets/'
let cache = {}

/**
 * Expose
 */

const cloudFS = module.exports = new Emitter()

cloudFS.url = url
cloudFS.loadCache = loadCache

function url (file) {
  if (file[0] === '.') {
    let trace = stackTrace.get()
    file = resolve(join(dirname(trace[1].getFileName()), file))
  }

  let u
  if (!cache[file]) {
    const content = fs.readFileSync(file)
    u = urify(file, content)
    cache[file] = u
    cloudFS.emit('read', u, content)
  } else {
    u = cache[file]
  }
  return u
}

function loadCache (c) {
  cache = c
}

/**
 * Urify
 *
 * Convert a file to a URL based
 * on the hash of its contents
 */

function urify (file, content) {
  const ext = extname(file)
  const name = basename(file).slice(0, -ext.length)
  const hash = farmhash.hash64(content)
  return `${BASE}${name}-${hash}${ext}`
}
