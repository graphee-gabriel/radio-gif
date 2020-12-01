function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export const getRandomElement = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null
  const { length } = array
  return array[getRandomInt(length)]
}

export const shuffleArray = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export const moveToTheFront = (array, finder) => {
  array.forEach((item, i) => {
    if (finder(item)) {
      array.splice(i, 1)
      array.unshift(item)
    }
  })
}
