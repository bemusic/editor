describe('a collection of objects', function () {
  it('allows objects to be added, given unique ID and data')
  it('allows objects to be updated, given the ID and updating instructions')
  it('allows objects to be removed, given the ID')
})

describe('time signatures', function () {
  it('allows a long song to be broken into multiple measures')
  it('are assumed to be 4/4 by default')
  it('can be different for each measure')
})

describe('musical time', function () {
  it('consists of measure number and fraction')
  it('can be converted into pulse number')
  it('can be converted from pulse number')
})

describe('time-dimension gridlines', function () {
  describe('barlines', function () {
    it('are at the beginning of each measure')
  })
  describe('major lines', function () {
    it('are on every quarter note, except when it overlaps the barline')
  })
  describe('minor lines', function () {
    it('can be configured, but will not display if it overlaps the barline or any major line')
  })
})
