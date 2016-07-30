module.exports = {
  timing: {
    initialBPM: 140,
    bpmChanges: [ { y: 960, bpm: 160 } ],
    stops: [ ]
  },
  notechart: {
    info: {
      author: 'flicknote'
    },
    notes: [
      { y: 960, x: 0, musicTrack: 1 },
      { y: 960, x: 7, musicTrack: 2 },
      { y: 1200, x: 3, musicTrack: 2 },
      { y: 1440, x: 5, musicTrack: 2 },
      { y: 1680, x: 3, musicTrack: 2 }
    ]
  },
  music: {
    trackCount: 8,
    info: {
      artist: 'flicknote',
      title: 'my song(?)'
    },
    regions: [
      {
        track: 1,
        y: 960,
        data: {
          type: 'audio',
          file: 'wow.ogg',
          slices: [ 0 ]
        }
      },
      {
        track: 2,
        y: 960,
        data: {
          type: 'sampler',
          l: 960,
          notes: [
            { t: 0, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
            { t: 240, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } },
            { t: 480, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
            { t: 720, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } }
          ]
        }
      }
    ]
  }
}
