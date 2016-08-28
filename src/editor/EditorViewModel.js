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
        title: column.title
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
      { width: 64, title: '1' },
      { width: 64, title: '2' },
      { width: 64, title: '3' },
      { width: 64, title: '4' },
      { width: 64, title: '5' },
      { width: 64, title: '6' },
      { width: 64, title: '7' },
      { width: 64, title: '8' },
      { width: 64, title: '9' },
      { width: 64, title: '10' },
      { width: 64, title: '11' },
      { width: 64, title: '12' },
      { width: 64, title: '13' },
      { width: 64, title: '14' },
      { width: 64, title: '15' },
      { width: 64, title: '16' }
    ]
  }
]
