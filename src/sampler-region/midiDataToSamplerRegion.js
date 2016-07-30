import * as MIDIData from '../midi-data/MIDIData'
import * as MIDINote from '../midi-data/MIDINote'

export function midiDataToSamplerRegion (midiData, resolution = 240) {
  const midiNotes = MIDIData.getNotes(midiData)
  const calculateBeat = MIDIData.getBeatCalculator(midiData)
  const pulseToY = (pulse) => Math.round(resolution * calculateBeat(pulse))
  const samplerNotes = midiNotes.map(note => {
    const startY = pulseToY(MIDINote.getStartPulse(note))
    const endY = pulseToY(MIDINote.getEndPulse(note))
    return {
      k: MIDINote.getKey(note),
      y: startY,
      l: endY - startY
    }
  })
  return {
    notes: samplerNotes
  }
}

export default midiDataToSamplerRegion
