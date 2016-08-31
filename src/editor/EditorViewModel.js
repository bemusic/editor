import { flow, keys, map, sortBy, identity } from 'lodash/fp'

export function calculateColumnGroupsViewModel (groups) {
  const columnGroups = [ ]
  let currentX = 64
  for (const group of groups) {
    const groupStartX = currentX
    const columns = [ ]
    for (const column of group.columns) {
      const columnStartX = currentX
      currentX += column.width
      columns.push({
        left: columnStartX,
        width: currentX - columnStartX,
        title: column.title,
        info: column.info
      })
    }
    columnGroups.push({
      left: groupStartX,
      width: currentX - groupStartX,
      columns: columns,
      title: group.title
    })
    currentX += 8
  }
  return { columnGroups, width: currentX }
}

export function calculateEditorHeight ({ songLengthBeats, zoomLevel }) {
  return (songLengthBeats + 3) * 48 * zoomLevel
}

export function getBeatToTop ({ zoomLevel, editorHeight }) {
  return (beat) => Math.round(editorHeight - 64 - beat * 48)
}

export function calculateGridlines ({
  yToBeat,
  beatToTop,
  majorGridline,
  minorGridline,
  songLengthTicks
}) {
  const out = { }
  const record = (y, type) => {
    out[beatToTop(yToBeat(y))] = type
  }
  for (let i = 0; i < songLengthTicks; i += minorGridline) record(i, 'minor')
  for (let i = 0; i < songLengthTicks; i += majorGridline) record(i, 'major')
  for (let i = 0; i < songLengthTicks; i += 960) record(i, 'bar')
  return flow(
    keys,
    map(key => +key),
    sortBy(identity),
    map(top => ({ top, type: out[top] }))
  )(out)
}

export const defaultColumnGroups = [
  {
    title: 'CONTROL',
    columns: [
      { width: 48, title: '/' },
      { width: 48, title: '♩' },
      { width: 48, title: '𝄐' }
    ]
  },
  {
    title: '譜面',
    columns: [
      { width: 62, title: '◎' },
      { width: 34, title: '1' },
      { width: 26, title: '2' },
      { width: 34, title: '3' },
      { width: 26, title: '4' },
      { width: 34, title: '5' },
      { width: 26, title: '6' },
      { width: 34, title: '7' }
    ]
  },
  {
    title: '音楽',
    columns: [
      { info: { type: 'music', track: 1 }, width: 64, title: '1' },
      { info: { type: 'music', track: 2 }, width: 64, title: '2' },
      { info: { type: 'music', track: 3 }, width: 64, title: '3' },
      { info: { type: 'music', track: 4 }, width: 64, title: '4' },
      { info: { type: 'music', track: 5 }, width: 64, title: '5' },
      { info: { type: 'music', track: 6 }, width: 64, title: '6' },
      { info: { type: 'music', track: 7 }, width: 64, title: '7' },
      { info: { type: 'music', track: 8 }, width: 64, title: '8' },
      { info: { type: 'music', track: 9 }, width: 64, title: '9' },
      { info: { type: 'music', track: 10 }, width: 64, title: '10' },
      { info: { type: 'music', track: 11 }, width: 64, title: '11' },
      { info: { type: 'music', track: 12 }, width: 64, title: '12' },
      { info: { type: 'music', track: 13 }, width: 64, title: '13' },
      { info: { type: 'music', track: 14 }, width: 64, title: '14' },
      { info: { type: 'music', track: 15 }, width: 64, title: '15' },
      { info: { type: 'music', track: 16 }, width: 64, title: '16' }
    ]
  }
]
