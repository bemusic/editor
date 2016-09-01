import assert from 'assert'
import MIDIEvents from 'midievents'
import MIDIFile from 'midifile'

import convertMidiFile from './convertMidiFile'

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
        console.log(result)
        assert.equal(numberOfKeysounds(result), 8)
      })
      it('should take into consideration the velocity of the note', () => {
        const result = convert(require('./test-fixtures/with-velocity-difference.mid'))
        assert.equal(numberOfNotes(result), 9)
        assert.equal(numberOfKeysounds(result), 9)
      })
      it('should result in another midi file', () => {
        const result = convert(require('./test-fixtures/with-velocity-difference.mid'))
        assertMidiEvents(result, [
          '0 note_on 58 98',
          '120 note_off 58',
          '480 note_on 58 98',
          '1080 note_off 58',
          '480 note_on 60 98',
          '120 note_off 60',
          '480 note_on 65 98',
          '120 note_off 65',
          '480 note_on 65 98',
          '1080 note_off 65',
          '480 note_on 70 63',
          '120 note_off 70',
          '480 note_on 70 98',
          '120 note_off 70',
          '480 note_on 72 98',
          '120 note_off 72',
          '480 note_on 74 98',
          '120 note_off 74'
        ])
      })
      it('should allow adjusting the spacing', () => {
        const result = convert(require('./test-fixtures/brass.mid'), {
          spacing: 60
        })
        assertMidiEvents(result, [
          '0 note_on 59 127',
          '120 note_off 59',
          '60 note_on 61 127',
          '60 note_off 61',
          '60 note_on 66 127',
          '180 note_off 66'
        ])
      })
    })
  })
})

function convert (arrayBuffer, options = { }) {
  const midiFile = new MIDIFile(arrayBuffer)
  return convertMidiFile(midiFile, 240, {
    spacing: options.spacing
  })
}

function numberOfNotes (result) {
  return result.samplerRegion.notes.length
}

function numberOfKeysounds (result) {
  return result.slices.length
}

function assertMidiEvents (result, expectedDescriptions) {
  const midiFile = result.midiFiles[0].midiFile
  const ppqn = midiFile.header.getTicksPerBeat()
  const actual = (midiFile.getTrackEvents(0)
    .filter((event) => event.type === MIDIEvents.EVENT_MIDI)
  )
  assert.equal(actual.length, expectedDescriptions.length)
  for (let i = 0; i < expectedDescriptions.length; i++) {
    const actualDescription = describeMidiEvent(actual[i])
    const expectedDescription = expectedDescriptions[i]
    assert.equal(
      actualDescription,
      expectedDescription,
      `Description of note[${i}] did not match. Expected ${expectedDescription} but actually it is ${actualDescription}.`
    )
  }

  function describeMidiEvent (event) {
    const Δ = Math.round(event.delta * 240 / ppqn)
    if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON) {
      return `${Δ} note_on ${event.param1} ${event.param2}`
    }
    if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_OFF) {
      return `${Δ} note_off ${event.param1}`
    }
    throw new Error('Unknown MIDI event: ' + require('util').inspect(event))
  }
}
