import React from 'react'
import invariant from 'invariant'
import { configure, storiesOf, action } from '@kadira/storybook'
import { basename } from 'path'

function loadStories() {
  const context = require.context('../src', true, /\.storybook\.js$/)
  for (const key of context.keys()) {
    const storybookModule = context(key)
    const storybookName = basename(key, '.storybook.js')
    const { stories } = storybookModule
    invariant(stories, 'stories must be exported from the storybook module')
    const storybook = storiesOf(storybookName)
    for (const storyName of Object.keys(stories)) {
      const fn = stories[storyName]
      storybook.add(storyName, () => (
        fn(action)
      ))
    }
  }
}

configure(loadStories, module)
