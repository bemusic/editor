
export function calculateColumnGroupsViewModel (groups) {
  const viewModel = [ ]
  let currentX = 8
  for (const group of groups) {
    const groupStartX = currentX
    const columns = [ ]
    for (const column of group.columns) {
      const columnStartX = currentX
      currentX += column.width
      columns.push({
        left: columnStartX,
        width: currentX - columnStartX
      })
    }
    viewModel.push({
      left: groupStartX,
      width: currentX - groupStartX,
      columns: columns
    })
    currentX += 8
  }
  return viewModel
}

const trackGroups = [
  {
    title: 'CONTROL',
    columns: [
      { width: 48, title: 'BPM' },
      { width: 48, title: 'STOP' }
    ]
  },
  {
    title: 'FUMEN',
    columns: [
      { width: 62, title: 'SARA' },
      { width: 34, title: '1' },
      { width: 26, title: '2' },
      { width: 34, title: '3' },
      { width: 26, title: '4' },
      { width: 34, title: '5' },
      { width: 26, title: '6' },
      { width: 34, title: '7' }
    ]
  },
  {
    title: 'ONGAKU',
    columns: [
      { width: 64, title: '1' },
      { width: 64, title: '2' },
      { width: 64, title: '3' },
      { width: 64, title: '4' },
      { width: 64, title: '5' },
      { width: 64, title: '6' },
      { width: 64, title: '7' },
      { width: 64, title: '8' },
      { width: 64, title: '9' },
      { width: 64, title: '10' },
      { width: 64, title: '11' },
      { width: 64, title: '12' },
      { width: 64, title: '13' },
      { width: 64, title: '14' },
      { width: 64, title: '15' },
      { width: 64, title: '16' }
    ]
  }
]