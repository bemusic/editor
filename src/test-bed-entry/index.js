
var TestBedMocha = require('test-bed/adapters/mocha')
TestBedMocha.setup({ ui: 'bdd' })

TestBedMocha.run({
  context: require.context(
    '../',
    true,
    /\.spec\.js$/
  )
})
