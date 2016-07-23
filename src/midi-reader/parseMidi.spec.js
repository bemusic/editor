import parseMidi, { createNoteBuffer } from './parseMidi'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

describe('the MIDI file parser', function () {
  it('should extract notes out of a midi file', () => {
    const buffer = fs.readFileSync(path.resolve(__dirname, 'test-fixtures', 'lead.mid'))
    const arrayBuffer = new Uint8Array(buffer).buffer
    const result = parseMidi(arrayBuffer)
    assert.equal(result.notes.length, 26)

    // The last note is on the 15th measure. It’s 4/4 time signature.
    assert.equal(result.notes[25].startBeat, result.ppqn * 4 * 15)
    assert.equal(result.notes[25].endBeat, result.ppqn * 4 * 17)

    // It’s 238bpm
    assert.equal(
      Math.round(result.notes[25].startTime),
      Math.round((60000 / 238) * 4 * 15)
    )
  })

  describe('matching note-on/note-off events', function () {
    it('should match the note on events with note off events', () => {
      const buffer = createNoteBuffer()
      buffer.noteOn(1, 20, 64, { data: 1 })
      const result = buffer.noteOff(1, 20, 0)
      assert.equal(result.data, 1)
    })

    it('should not match the same note twice', () => {
      const buffer = createNoteBuffer()
      buffer.noteOn(1, 20, 64, { data: 1 })
      buffer.noteOff(1, 20, 0)
      const result = buffer.noteOff(1, 20, 0)
      assert.equal(result, null)
    })

    it('should match note with matching velocity first', () => {
      const buffer = createNoteBuffer()
      buffer.noteOn(1, 20, 64, { _id: 1 })
      buffer.noteOn(1, 20, 80, { _id: 2 })
      assert.equal(buffer.noteOff(1, 20, 80)._id, 2)
      assert.equal(buffer.noteOff(1, 20, 64)._id, 1)
    })

    it('selects first-inserted note when ambiguous', () => {
      const buffer = createNoteBuffer()
      buffer.noteOn(1, 20, 64, { _id: 1 })
      buffer.noteOn(1, 20, 64, { _id: 2 })
      assert.equal(buffer.noteOff(1, 20, 64)._id, 1)
      assert.equal(buffer.noteOff(1, 20, 64)._id, 2)
    })

    it('does not match note on different channel', () => {
      const buffer = createNoteBuffer()
      buffer.noteOn(1, 20, 64, { _id: 1 })
      assert.equal(buffer.noteOff(2, 20, 64), null)
    })
  })
})
