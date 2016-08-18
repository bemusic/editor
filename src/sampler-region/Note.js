
export const init = (key, start, length) => ({
  k: key,
  y: start,
  l: length
})

export const key = ({ k }) => k
export const start = ({ y }) => y
export const length = ({ l }) => l
export const end = (note) => start(note) + length(note)
