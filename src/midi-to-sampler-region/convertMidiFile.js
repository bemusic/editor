import * as Note from '../sampler-region/Note'

import _ from 'lodash'
import invariant from 'invariant'
import MIDIEvents from 'midievents'
import MIDIFile from 'midifile'

export function convertMidiFile (midi, resolution = 240, {
  spacing = 480
} = { }) {
  const ppqn = midi.header.getTicksPerBeat()
  const slices = (() => {
    const events = midi.getEvents()
    const midiSpacing = Math.round(ppqn * spacing / resolution)
    const slicesBuilder = createSlicesBuilder({ spacing: midiSpacing })
    for (const event of events) slicesBuilder.handleEvent(event)
    return slicesBuilder.build()
  })()

  const uniqueSlices = _.sortBy(_.uniqBy(slices, 'uniqueKey'), 'sortKey')

  const pulseToY = (pulse) => Math.round(resolution * (pulse / ppqn))
  const samplerNotes = slices.map(slice => {
    const startY = pulseToY(slice.startPulse)
    const endY = pulseToY(slice.endPulse)
    return Note.init(slice.key, startY, endY - startY)
  })
  const samplerRegion = {
    notes: samplerNotes,
    l: _.max(_.map(samplerNotes, Note.end))
  }
  return {
    samplerRegion,
    slices: uniqueSlices,
    midiFiles: [ { midiFile: generateMidi() } ]
  }

  function generateMidi () {
    const outFile = new MIDIFile()
    outFile.header.setTicksPerBeat(ppqn)
    const events = [ ]
    let nextPreviousOffset = 0
    for (const slice of uniqueSlices) {
      let previousOffset = nextPreviousOffset
      for (let { data, pulseOffset } of slice.events) {
        events.push({ ...data, delta: pulseOffset - previousOffset })
        previousOffset = pulseOffset
      }
      nextPreviousOffset = -slice.rightPadding
    }
    events.push({
      delta: 0,
      type: MIDIEvents.EVENT_META,
      subtype: MIDIEvents.EVENT_META_END_OF_TRACK,
      length: 0
    })
    outFile.setTrackEvents(0, events)
    return outFile
  }
}

const normalSlicer = ({ spacing }) => (monitor) => {
  const startPulse = monitor.getCurrentPulse()
  let endPulse = startPulse
  const events = [ ]
  const activeNotes = [ ]
  const slice = {
    shouldAcceptNoteOn (event) {
      return false // each note gets its own slice, ok?
    },
    shouldAcceptNoteOff (event) {
      return _.some(activeNotes, { note: event.param1, channel: event.channel })
    },
    receiveEvent (event) {
      const currentPulse = monitor.getCurrentPulse()
      events.push({
        pulseOffset: currentPulse - startPulse,
        data: event
      })
      endPulse = currentPulse
      if (isNoteOn(event)) {
        activeNotes.push({ note: event.param1, channel: event.channel })
      } else if (isNoteOff(event)) {
        const note = _.find(activeNotes, { note: event.param1, channel: event.channel })
        if (note) _.pull(activeNotes, note)
      }
    },
    shouldDestroy () {
      return activeNotes.length === 0
    },
    build () {
      const keyify = (value) => ('00000000' + value.toString(16)).substr(-8)
      const sortKey = [
        events[0].data.channel,
        events[0].data.param1,
        events[0].data.param2,
        endPulse - startPulse
      ].map(keyify).join(':')
      invariant(events.length >= 2, 'Expected at least two events in %s', JSON.stringify(events))

      return {
        key: events[0].data.param1,
        rightPadding: spacing,
        sortKey,
        uniqueKey: sortKey,
        startPulse,
        endPulse,
        events
      }
    }
  }
  return slice
}

function createSlicesBuilder ({ spacing }) {
  const createSliceBuilder = normalSlicer({ spacing })
  let currentPulse = 0
  let currentTime = 0
  const sliceBuilders = [ ]
  const activeSliceBuilders = new Set()

  const monitor = {
    getCurrentPulse () {
      return currentPulse
    },
    getCurrentTime () {
      return currentTime
    }
  }

  return {
    handleEvent (event) {
      currentPulse += event.delta
      currentTime = event.playTime

      if (isNoteOn(event)) {
        const slice = getSliceBuilderAcceptingNoteOn(event)
        if (slice) {
          slice.receiveEvent(event)
        } else {
          const newSlice = createSliceBuilder(monitor)
          newSlice.receiveEvent(event)
          sliceBuilders.push(newSlice)
          activeSliceBuilders.add(newSlice)
        }
      } else if (isNoteOff(event)) {
        const slice = getSliceBuilderAcceptingNoteOff(event)
        if (slice) {
          slice.receiveEvent(event)
          if (slice.shouldDestroy()) {
            activeSliceBuilders.delete(slice)
          }
        }
      }
    },
    build () {
      return sliceBuilders.map((sliceBuilder) => sliceBuilder.build())
    }
  }

  function getSliceBuilderAcceptingNoteOn (event) {
    for (const slice of activeSliceBuilders) {
      if (slice.shouldAcceptNoteOn(event)) {
        return slice
      }
    }
    return null
  }

  function getSliceBuilderAcceptingNoteOff (event) {
    for (const slice of activeSliceBuilders) {
      if (slice.shouldAcceptNoteOff(event)) {
        return slice
      }
    }
    return null
  }
}

function isNoteOn (event) {
  return (
    event.type === MIDIEvents.EVENT_MIDI &&
    event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON &&
    event.param2 > 0
  )
}

function isNoteOff (event) {
  return (
    event.type === MIDIEvents.EVENT_MIDI &&
    (
      (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON && event.param2 === 0) ||
      event.subtype === MIDIEvents.EVENT_MIDI_NOTE_OFF
    )
  )
}

export default convertMidiFile
