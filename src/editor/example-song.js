import midiDataToSamplerRegion from '../midi-to-sampler-region/midiDataToSamplerRegion'
import parseMidi from '../midi-reader/parseMidi'

export default function loadExampleSong (callback) {
  const data = require('../midi-to-sampler-region/test-fixtures/drum.mid')
  const midi = parseMidi(data)
  const samplerRegion = midiDataToSamplerRegion(midi)
  const song = {
    info: {
      length: samplerRegion.l + 960 + 960 * 4
    },
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
      info: {
        trackCount: 8,
        artist: 'flicknote',
        title: 'my song(?)'
      },
      regions: [
        {
          track: 1,
          y: 960,
          data: {
            type: 'audio',
            data: {
              file: 'wow.ogg',
              l: 1920,
              slices: [ 0 ]
            }
          }
        },
        {
          track: 2,
          y: 960,
          data: {
            type: 'sampler',
            data: {
              l: 960,
              notes: [
                { y: 0, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
                { y: 240, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } },
                { y: 480, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
                { y: 720, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } }
              ]
            }
          }
        },
        {
          track: 5,
          y: 960,
          data: {
            type: 'sampler',
            data: samplerRegion
          }
        }
      ]
    }
  }
  callback(song)
}
