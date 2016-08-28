import * as EditorViewModel from './EditorViewModel'

import assert from 'assert'

/* global describe, it */
describe('editor column groups', function () {
  it('should be arranged vertically, each column group separated by blank space', () => {
    const groups = [
      { title: 'A', columns: [ { width: 32 } ] },
      { title: 'B', columns: [ { width: 64 }, { width: 20 } ] }
    ]
    const viewModel = EditorViewModel.calculateColumnGroupsViewModel(groups)
    const { columnGroups } = viewModel

    // Asserting the individual group…
    assert.equal(columnGroups[0].left, 64)
    assert.equal(columnGroups[0].width, 32)
    assert.equal(columnGroups[1].left, 64 + 32 + 8)
    assert.equal(columnGroups[1].width, 64 + 20)

    // Asserting the columns…
    assert.equal(columnGroups[0].columns[0].left, 64)
    assert.equal(columnGroups[0].columns[0].width, 32)
    assert.equal(columnGroups[1].columns[1].left, 64 + 32 + 8 + 64)
    assert.equal(columnGroups[1].columns[1].width, 20)
  })
})

describe('editor height', function () {
  it('at zoom level 1, should have 48 pixels per beat + 3 beats padding', () => {
    assert.equal(EditorViewModel.calculateEditorHeight({
      songLengthBeats: 4 * 20,
      zoomLevel: 1
    }), 192 * 20 + 2 * 48)
  })
})

describe('horizontal gridlines', function () {
  it('should contain bar-grid, major-grid, minor-grid', () => {
    const gridlines = EditorViewModel.calculateGridlines({
      beatToTop: (beat) => 1000 - beat * 48,
      yToBeat: (y) => y / 240,
      majorGridline: 240,
      minorGridline: 60,
      songLengthTicks: 10 * 240
    })
    assert.equal(gridlines.length, 40)

    gridlines.reverse()
    assert.equal(gridlines[0].top, 1000)
    assert.equal(gridlines[0].type, 'bar')
    assert.equal(gridlines[1].top, 988)
    assert.equal(gridlines[1].type, 'minor')
  })
})
