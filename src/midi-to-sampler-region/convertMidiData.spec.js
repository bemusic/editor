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
      it('should result in another midi file', () => {
        const result = convert(require('./test-fixtures/with-velocity-difference.mid'))
        const actualEvents = resultingMidiFileEvents(result)
        const expectedEvents = [
          '0 note_on 58 98',
          '120 note_off 58 98',
          '480 note_on 58 98',
          '1080 note_on 58 98',
          '480 note_on 60 98',
          '120 note_off 60 98',
          '480 note_on 65 98',
          '120 note_off 65 98',
          '480 note_on 65 98',
          '1080 note_on 65 98',
          '480 note_on 70 63',
          '120 note_off 70 63',
          '480 note_on 70 98',
          '120 note_on 70 98',
          '480 note_on 72 98',
          '120 note_on 72 98',
          '480 note_on 74 98',
          '120 note_on 74 98',
          'end of track'
        ]
        assert.equal(actualEvents.length, expectedEvents.length)
        // TODO: make sure each event matches
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

function resultingMidiFileEvents (result) {
  return result.midiFiles[0].midiFile.getTrackEvents(0)
}
