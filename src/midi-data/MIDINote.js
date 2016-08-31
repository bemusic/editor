
export const getKey = (note) => note.key
export const getStartPulse = (note) => note.startPulse
export const getEndPulse = (note) => note.endPulse
export const getVelocity = (note) => note.velocity
export const getPulseLength = (note) => (
  getEndPulse(note) - getStartPulse(note)
)
