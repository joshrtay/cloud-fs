/**
 * Modules
 */

const Emitter = require('events')
const fs = require('fs')
const {extname, basename, resolve, dirname, join} = require('path')
const farmhash = require('farmhash')
const stackTrace = require('stack-trace')
const findRoot = require('find-root')
const mkdirp = require('mkdirp')


/**
 * Vars
 */

const BASE = process.env.CLOUD_FS || '/assets/'
const DEVELOPMENT = process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === undefined
const DIR = assetDir()
let cache = {}

/**
 * Expose
 */

exports.url = url
exports.loadCache = loadCache

/**
 * Generate a url for a file
 * @param  {String} file path to file
 * @return {String}      url
 */

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
    writeAsset(u, content)
  } else {
    u = cache[file]
  }
  return `${BASE}${u}`
}

/**
 * Write an asset out to the assets dir
 * @param {String} u       url
 * @param {Buffer} content file contents
 */

function writeAsset (u, content) {
  if (DEVELOPMENT) {
    if (!fs.existsSync(DIR)) {
      mkdirp.sync(DIR)
    }
    const file = join(DIR, u)
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, content)
    }
  }
}

/**
 * Load new cache
 * @param  {Object} c cache
 */

function loadCache (c) {
  cache = c
}

/**
 * Get the asset dir from the package.json
 * @return {String} asset dir
 */

function assetDir () {
  const dir = findRoot(process.cwd())
  const assetDir = JSON.parse(fs.readFileSync(join(dir, 'package.json'))).cloudFS || './assets'
  return resolve(join(dir, assetDir))
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
  return `${name}-${hash}${ext}`
}
