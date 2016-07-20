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

    // Asserting the groups
    assert.equal(viewModel[0].left, 8)
    assert.equal(viewModel[0].width, 32)
    assert.equal(viewModel[1].left, 8 + 32 + 8)
    assert.equal(viewModel[1].width, 64 + 20)

    // Asserting the columns
    assert.equal(viewModel[0].columns[0].left, 8)
    assert.equal(viewModel[0].columns[0].width, 32)
    assert.equal(viewModel[1].columns[1].left, 112)
    assert.equal(viewModel[1].columns[1].width, 20)
  })
})
