import * as MIDIData from '../midi-data/MIDIData'
import * as MIDINote from '../midi-data/MIDINote'
import * as Note from '../sampler-region/Note'

import _ from 'lodash'
import MIDIEvents from 'midievents'
import MIDIFile from 'midifile'

export function convertMidiData (midiData, resolution = 240) {
  const midiNotes = MIDIData.getNotes(midiData)
  const calculateBeat = MIDIData.getBeatCalculator(midiData)
  const pulseToY = (pulse) => Math.round(resolution * calculateBeat(pulse))
  const slices = slice(midiNotes, { pulseToY })

  const outFile = new MIDIFile()
  outFile.header.setTicksPerBeat(240)
  const events = [ ]
  let nextDelta = 0
  for (const slice of slices) {
    events.push({
      delta: nextDelta,
      type: MIDIEvents.EVENT_MIDI,
      subtype: MIDIEvents.EVENT_MIDI_NOTE_ON,
      channel: 0,
      param1: slice[0].key,
      param2: slice[0].velocity
    })
    const startY = pulseToY(MIDINote.getStartPulse(slice[0]))
    const endY = pulseToY(MIDINote.getEndPulse(slice[0]))
    const length = endY - startY
    events.push({
      delta: length,
      type: MIDIEvents.EVENT_MIDI,
      subtype: MIDIEvents.EVENT_MIDI_NOTE_OFF,
      channel: 0,
      param1: slice[0].key,
      param2: slice[0].velocity
    })
    nextDelta = 480
  }
  events.push({
    delta: 0,
    type: MIDIEvents.EVENT_META,
    subtype: MIDIEvents.EVENT_META_END_OF_TRACK,
    length: 0
  })
  outFile.setTrackEvents(0, events)

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
    samplerRegion,
    slices,
    midiFiles: [ { midiFile: outFile } ]
  }
}

function slice (midiNotes, { pulseToY }) {
  const groups = { }
  const getKey = (note) => {
    const key = MIDINote.getKey(note)
    const startY = pulseToY(MIDINote.getStartPulse(note))
    const endY = pulseToY(MIDINote.getEndPulse(note))
    const length = endY - startY
    const velocity = MIDINote.getVelocity(note)
    return `${key}:${velocity}:${length}`
  }
  for (const note of midiNotes) {
    const key = getKey(note)
    const group = groups[key] || (groups[key] = [ ])
    group.push(note)
  }
  return _.values(groups)
}

export default convertMidiData
