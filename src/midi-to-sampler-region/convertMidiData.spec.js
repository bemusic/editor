import assert from 'assert'

import convertMidiData from './convertMidiData'
import parseMidi from '../midi-reader/parseMidi'

describe('converting a MIDI data to sampler region', function () {
  describe('the resulting region', function () {
    it('should have an equal number of notes to the MIDI data', () => {
      const result = convert(require('../midi-reader/test-fixtures/piano.mid'))
      assert.equal(numberOfNotes(result), 341)
    })
  })

  describe('the resulting keysounds', function () {
    describe('when slicing normally', function () {
      it('should result in each unique note being unique keysound', () => {
        const result = convert(require('./test-fixtures/no-velocity-difference.mid'))
        assert.equal(numberOfNotes(result), 9)
        assert.equal(numberOfKeysounds(result), 8)
      })
      it('should take into consideration the velocity of the note', () => {
        const result = convert(require('./test-fixtures/with-velocity-difference.mid'))
        assert.equal(numberOfNotes(result), 9)
        assert.equal(numberOfKeysounds(result), 9)
      })
    })
  })
})

function convert (arrayBuffer) {
  const midiData = parseMidi(arrayBuffer)
  return convertMidiData(midiData, 240)
}

function numberOfNotes (result) {
  return result.samplerRegion.notes.length
}

function numberOfKeysounds (result) {
  return result.slices.length
}
