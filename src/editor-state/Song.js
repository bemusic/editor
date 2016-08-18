
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

export const length = (song) => song.info.length
