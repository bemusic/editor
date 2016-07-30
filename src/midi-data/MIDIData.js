
export const initialize = ({ notes, ppqn }) => ({ notes, ppqn })

export const getNotes = ({ notes }) => notes
export const getPPQN = ({ ppqn }) => ppqn
export const getBeatCalculator = ({ ppqn }) => (y) => y / ppqn
