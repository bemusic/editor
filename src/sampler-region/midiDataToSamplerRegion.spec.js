import parseMidi from '../midi-reader/parseMidi'
import _ from 'lodash'
import midiDataToSamplerRegion from './midiDataToSamplerRegion'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

describe('converting a MIDI data to sampler region', function () {
  const getFixture = _.once(() => {
    const buffer = fs.readFileSync(path.resolve(__dirname, '..', 'midi-reader', 'test-fixtures', 'piano.mid'))
    const arrayBuffer = new Uint8Array(buffer).buffer
    const midiData = parseMidi(arrayBuffer)
    return midiDataToSamplerRegion(midiData, 240)
  })

  describe('the resulting region', function () {
    it('should have an equal number of notes to the MIDI data', () => {
      const samplerRegion = getFixture()
      assert(Array.isArray(samplerRegion.notes), 'notes should be an array')
      assert.equal(samplerRegion.notes.length, 341)
    })
  })
})
