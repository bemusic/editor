import * as MIDIData from '../midi-data/MIDIData'
import * as MIDINote from '../midi-data/MIDINote'
import * as Note from '../sampler-region/Note'

import _ from 'lodash'

export function convertMidiData (midiData, resolution = 240) {
  const midiNotes = MIDIData.getNotes(midiData)
  const calculateBeat = MIDIData.getBeatCalculator(midiData)
  const pulseToY = (pulse) => Math.round(resolution * calculateBeat(pulse))

  const samplerNotes = midiNotes.map(note => {
    const startY = pulseToY(MIDINote.getStartPulse(note))
    const endY = pulseToY(MIDINote.getEndPulse(note))
    return Note.init(MIDINote.getKey(note), startY, endY - startY)
  })

  const samplerRegion = {
    notes: samplerNotes,
    l: _.max(_.map(samplerNotes, Note.end))
  }
  return {
    samplerRegion
  }
}

export default convertMidiData
