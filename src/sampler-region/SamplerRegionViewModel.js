import _ from 'lodash'
import * as SamplerRegion from './SamplerRegion'
import * as Note from './Note'

export function getViewModel (samplerRegion, {
  width,
  height
}) {
  return {
    notes: notesViewModelForNotes(samplerRegion.notes, {
      width,
      startTop: height,
      endTop: 0,
      startY: 0,
      endY: SamplerRegion.length(samplerRegion)
    })
  }
}

export function notesViewModelForNotes (notes, {
  width,
  startTop,
  endTop,
  startY,
  endY
}) {
  const leftMetrics = createLeftMetrics()
  const topMetrics = createTopMetrics()

  return notes.map(convert)

  function convert (note) {
    const { left, width } = leftMetrics.leftAndWidth(Note.key(note))
    const { top, height } = topMetrics.topAndHeight(Note.start(note), Note.end(note))
    return { left, width, top, height }
  }

  function createLeftMetrics () {
    const keys = notes.map(Note.key)
    const min = _.min(keys)
    const max = _.max(keys)
    const noteWidth = Math.max(2, Math.round(width / (max - min + 1)))
    return {
      leftAndWidth (key) {
        return {
          left: Math.round((key - min) / (max - min + 1) * (width / noteWidth)),
          width: noteWidth
        }
      }
    }
  }

  function createTopMetrics () {
    return {
      topAndHeight (y1, y2) {
        const top1 = top(y1)
        const top2 = top(y2)
        return {
          top: Math.min(top1, top2),
          height: Math.abs(top1 - top2)
        }
      }
    }

    function top (y) {
      return startTop + (y - startY) / (endY - startY) * (endTop - startTop)
    }
  }
}
