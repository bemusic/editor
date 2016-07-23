import MIDIFile from 'midifile'
import MIDIEvents from 'midievents'
import * as MIDIData from '../midi-data/MIDIData'

export function parseMidi (buffer) {
  const midi = new MIDIFile(buffer)

  if (midi.header.getTimeDivision() !== MIDIFile.Header.TICKS_PER_BEAT) {
    throw new Error('Unsupported MIDI file: File must have TICKS_PER_BEAT time division.')
  }

  const ppqn = midi.header.getTicksPerBeat()
  const events = midi.getEvents()
  const builder = createMidiBuilder(ppqn)
  for (const event of events) {
    builder.tick(event.delta, event.playTime)
    if (event.type === MIDIEvents.EVENT_MIDI) {
      if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON) {
        const { channel, param1: key, param2: velocity } = event
        if (velocity > 0) {
          builder.noteOn(channel, key, velocity)
        } else {
          builder.noteOff(channel, key, velocity)
        }
      } else if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_OFF) {
        const { channel, param1: key, param2: velocity } = event
        builder.noteOff(channel, key, velocity)
      }
    }
  }
  return builder.build()
}

function createMidiBuilder (ppqn) {
  let y = 0
  let t = 0
  let nextId = 1
  const buffer = createNoteBuffer()
  const notes = [ ]
  return {
    tick (delta, playTime) {
      y += delta
      t = playTime
    },
    noteOn (channel, key, velocity) {
      const startNote = { y, t, channel, key, velocity }
      buffer.noteOn(channel, key, velocity, startNote)
    },
    noteOff (channel, key, velocity) {
      const startNote = buffer.noteOff(channel, key, velocity)
      if (startNote) {
        const note = {
          _id: nextId++,
          startTime: startNote.t,
          startBeat: startNote.y,
          endTime: t,
          endBeat: y,
          channel: startNote.channel,
          key: startNote.key,
          velocity: startNote.velocity
        }
        notes.push(note)
      }
    },
    build () {
      return MIDIData.initialize({ notes, ppqn })
    }
  }
}

export function createNoteBuffer () {
  let activeNotes = [ ]

  return { noteOn, noteOff }

  function noteOn (channel, key, velocity, payload) {
    activeNotes.push({ channel, key, velocity, payload })
  }

  function noteOff (channel, key, velocity) {
    const matching = (
      findNote(channel, key, (note) => note.velocity === velocity) ||
      findNote(channel, key, () => true)
    )
    if (!matching) return null
    activeNotes = activeNotes.filter(note => note !== matching)
    return matching.payload
  }

  function findNote (channel, key, criteria) {
    for (const activeNote of activeNotes) {
      if (activeNote.channel !== channel) continue
      if (activeNote.key !== key) continue
      if (!criteria(activeNote)) continue
      return activeNote
    }
  }
}

export default parseMidi
