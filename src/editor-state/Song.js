
export const empty = {
  info: {
    length: 960
  },
  timing: {
    initialBPM: 60,
    bpmChanges: [ ],
    stops: [ ]
  },
  notechart: {
    info: { },
    notes: [ ]
  },
  music: {
    trackCount: 8,
    info: { },
    regions: [ ]
  }
}

// -- Queries --

export const yToBeat = (y) => y / 240
export const lengthTicks = (song) => song.info.length
export const lengthBeats = (song) => yToBeat(lengthTicks(song))

export const getMusicRegions = (song) => song.music.regions
