/**
 * Imports
 */

const test = require('tape')
const cloudFS = require('..')
const {join} = require('path')

/**
 * Tests
 */

const ELLIOT_URL = "/assets/elliot-2466557555267872952.jpg"

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

test('should be able to listen to adds', (t) => {
  cloudFS.loadCache({})
  cloudFS.on('read', url => {
    t.equal(url, ELLIOT_URL)
    t.end()
  })
  cloudFS.url('./elliot.jpg')
})
