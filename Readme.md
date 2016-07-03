
# cloud-fs

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Keep assets in the cloud.

## Installation

    $ npm install cloud-fs

## Usage

```js
const {url} = require('cloud-fs')
const faviconURL = url('./favicon.ico')
```

## API

### .url(file)

- `file` - relative or absolute path to file

**Returns:** url for file

### .loadCache(cache)

- `cache` - new cache of files to urls

## License

MIT

[travis-image]: https://img.shields.io/travis/joshrtay/cloud-fs.svg?style=flat-square
[travis-url]: https://travis-ci.org/joshrtay/cloud-fs
[git-image]: https://img.shields.io/github/tag/joshrtay/cloud-fs.svg?style=flat-square
[git-url]: https://github.com/joshrtay/cloud-fs
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/cloud-fs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cloud-fs
