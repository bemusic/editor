
export const key = ({ k }) => k
export const start = ({ y }) => y
export const length = ({ l }) => l
export const end = (note) => start(note) + length(note)
