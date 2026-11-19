interface item {
    catId: string,
    matched: boolean,
    flipped: boolean,
    blobPath: string
}

export function randomize(catcards: Array<item>) {
  let arrayCopy = [...catcards]
  for (let i = 11; i >= 0; i--) {
    let tmp = arrayCopy[i]
    let randomInt = getRandomInt(i)
    arrayCopy[i] = arrayCopy[randomInt]
    arrayCopy[randomInt] = tmp
  }
  return arrayCopy;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}