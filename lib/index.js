/**
 * Modules
 */

const fs = require('fs')
const {extname, basename, resolve, dirname, join} = require('path')
const farmhash = require('farmhash')
const stackTrace = require('stack-trace')
const mkdirp = require('mkdirp')
const rework = require('rework')
const reworkUrl = require('rework-plugin-url')
const url = require('url')

/**
 * Vars
 */

const BASE = process.env.CLOUD_FS_URL || '/assets/'
const DEVELOPMENT = process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
let ASSETS_DIR = join(process.cwd(), '/assets')

/**
 * Expose
 */

exports.url = getUrl
exports.setAssetsDir = setAssetsDir

/**
 * Generate a url for a file
 * @param  {String} file path to file
 * @return {String}      url
 */

function getUrl (file, opts) {
  opts = opts || {}

  if (file[0] === '.') {
    if (!opts.filename) {
      opts.filename = stackTrace.get()[1].getFileName()
    }
    file = resolve(join(dirname(opts.filename), file))
  }

  let content = fs.readFileSync(file)
  if (isCss(file)) {
    content = rework(content.toString()).use(reworkUrl(rewriteUrl(opts))).toString()
  }
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

/**
 * Rewrite url
 * @param  {Options} opts for getUrl
 * @return {Function}
 */

function rewriteUrl (opts) {
  return u => {
    if (isRelative(u)) {
      return getUrl(`./${u}`, opts)
    } else {
      return u
    }
  }
}

/**
 * Check if file name is a css file
 * @param  {String}  file
 * @return {Boolean}
 */

function isCss (file) {
  return file.endsWith('.css')
}

/**
 * Check if a url is a relative url
 * @param  {String}  u url
 * @return {Boolean}
 */

function isRelative (u) {
  return url.parse(u).pathname === u
}
