/**
 * Imports
 */

const test = require('tape')
const cloudFS = require('..')
const {join} = require('path')
const fs = require('fs')

/**
 * Tests
 */

const ELLIOT_URL = '/assets/elliot-2466557555267872952.jpg'
const CSS_URL = '/assets/main-15457945457857399425.css'

test('should return url properly', (t) => {
  const url = cloudFS.url(join(__dirname, './elliot.jpg'))
  t.equal(url, ELLIOT_URL)
  t.end()
})

test('should work with relative path', (t) => {
  const url = cloudFS.url('./elliot.jpg')
  t.equal(url, ELLIOT_URL)
  t.end()
})

test('should write to assets dir', (t) => {
  cloudFS.url('./elliot.jpg')
  t.ok(fs.existsSync(join(process.cwd(), ELLIOT_URL)))
  t.end()
})

test('should write css to dir and rewrite url', (t) => {
  cloudFS.url('./main.css')
  t.ok(fs.existsSync(join(process.cwd(), CSS_URL)))
  t.ok(fs.readFileSync(join(process.cwd(), CSS_URL)).indexOf(ELLIOT_URL) > 0)
  t.end()
})
