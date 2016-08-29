'use strict'

// Hacks module system to be able to require MIDI files!
require.extensions['.mid'] = (module, filename) => {
  const fs = require('fs')
  const buffer = fs.readFileSync(filename)
  const result = 'module.exports = new Uint8Array(new Buffer(' + JSON.stringify(buffer.toString('base64')) + ',"base64")).buffer'
  return module._compile(result, filename)
}
