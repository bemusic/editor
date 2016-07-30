import assert from 'assert'
import * as SamplerRegionViewModel from './SamplerRegionViewModel'

describe('the view of sampler region', function () {
  it('should arrange notes inside the container', () => {
    const notes = [
      { y: 0, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
      { y: 240, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } },
      { y: 480, l: 120, k: 36, sample: { file: 'drum', slice: [ 0, 1 ] } },
      { y: 720, l: 120, k: 38, sample: { file: 'drum', slice: [ 4, 5 ] } }
    ]

    const result = SamplerRegionViewModel.notesViewModelForNotes(notes, {
      width: 120,
      startTop: 160,
      endTop: 0,
      startY: 0,
      endY: 960
    })

    assert.equal(result.length, 4)

    assert.equal(result[0].left, 0)
    assert.equal(result[0].width, 40)
    assert.equal(result[0].top, 140)
    assert.equal(result[0].height, 20)
  })
})
