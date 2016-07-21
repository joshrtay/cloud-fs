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

const BASE = process.env.CLOUD_FS_URL || '/assets/'
const DEVELOPMENT = process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === undefined
let ASSETS_DIR = join(process.cwd(), '/assets')

/**
 * Expose
 */

exports.url = url
exports.setAssetsDir = setAssetsDir

/**
 * Generate a url for a file
 * @param  {String} file path to file
 * @return {String}      url
 */

function url (file, opts) {
  opts = opts || {}

  if (file[0] === '.') {
    if (!opts.filename) {
      opts.filename = stackTrace.get()[1].getFileName()
    }
    file = resolve(join(dirname(opts.filename), file))
  }

  const content = fs.readFileSync(file)
  const u = urify(file, content)
  writeAsset(u, content)
  return `${BASE}${u}`
}

/**
 * Write an asset out to the assets dir
 * @param {String} u       url
 * @param {Buffer} content file contents
 */

function writeAsset (u, content) {
  if (DEVELOPMENT) {
    if (!fs.existsSync(ASSETS_DIR)) {
      mkdirp.sync(ASSETS_DIR)
    }
    const file = join(ASSETS_DIR, u)
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, content)
    }
  }
}

/**
 * Get the asset dir from the package.json
 * @return {String} asset dir
 */

function setAssetsDir (dir) {
  ASSETS_DIR = dir
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
