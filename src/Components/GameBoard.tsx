import { useState, useEffect, useRef } from 'react'
import Square from './Square.tsx'
import './GameBoard.css'

interface item {
    catId: string,
    matched: boolean,
    flipped: boolean,
    blobPath: string
}

function randomize(catcards: Array<item>) {
  let arrayCopy = [...catcards]
  for (let i = 11; i >= 0; i--) {
    let tmp = arrayCopy[i]
    let randomInt = getRandomInt(i)
    arrayCopy[i] = arrayCopy[randomInt]
    arrayCopy[randomInt] = tmp
  }
  return arrayCopy;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export interface GameBoardProps {
    swappedIds: Array<string>,
    clicks: number,
    setClicks: (clicks:number) => void,
    setGameOver: (gameOver: boolean) => void,
}

export default function GameBoard({swappedIds, clicks, setClicks, setGameOver}: GameBoardProps) {
  console.log('the ids are ', swappedIds)
  const CAT_COUNT = swappedIds.length / 2

  let countRef = useRef(0)

  function onSquareClick(index: number, id: string) {

    let tempSquares = [...squares]
    let flippedSquares: Array<number> = []

    //Check to see if the current square is face up
    if (tempSquares[index]['flipped'] || tempSquares[index]['matched']) {
      return;
    }

    else {
      //Create a list of flipped squares
      //When a square is clicked, derive the flipped squares from the array of squares
      for (let i = 0; i < tempSquares.length; ++i) {
        if (tempSquares[i]['flipped']) {
          flippedSquares.push(i)
        }
      }      
      //If this is the first one, just flip it
      if (flippedSquares.length == 0) {
        tempSquares[index]['flipped'] = true
      }
      //If there is only one, flip it then check if there's a match
      else if (flippedSquares.length == 1) {
        tempSquares[index]['flipped'] = true
        if (tempSquares[flippedSquares[0]]['catId'] == id) {
          tempSquares[flippedSquares[0]]['matched'] = true
          tempSquares[index]['matched'] = true
          countRef.current++
          //matches++
          //console.log('countRef.current', countRef.current)
          if (countRef.current === CAT_COUNT) {
          //if (matches === CAT_COUNT) {
            //console.log('setting gameOver')
            countRef.current = 0
            //matches = 0
            setGameOver(true)
          }


        }
      }
      //If there are already two, clear the existing flips and flip the clicked one
      else {
        tempSquares[flippedSquares[0]]['flipped'] = false
        tempSquares[flippedSquares[1]]['flipped'] = false
        tempSquares[index]['flipped'] = true
      }
    }
    
    let newClicks = clicks + 1
    setClicks(newClicks)
    setSquares(tempSquares)
  }

  let [squares, setSquares] = useState<item[]>([])

  const basePath = "https://cataas.com/cat/"
  const params = "?type=square&position=center"


  useEffect(() => {

    async function fetchPaths() {
      let tempSquares: Array<item> = []
      for (const id in swappedIds) {
        let catUrl = await fetch(basePath+swappedIds[id]+params)
        let catBlob = await catUrl.blob()
        let catBlobPath = URL.createObjectURL(catBlob)
        const item = {
          catId: swappedIds[id],
          matched: false,
          flipped: false,
          blobPath: catBlobPath,
        }
        tempSquares.push(item)
      }
      await Promise.all(tempSquares)
      tempSquares = randomize(tempSquares)
      setSquares(tempSquares)
    }

    if (swappedIds.length <= 1) return
    fetchPaths()

  }, [swappedIds])


  if (squares.length < 12) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="game-board">
      {squares.map((item, itemIndex) => (
        <Square index={itemIndex} model={squares[itemIndex]} onClick={onSquareClick}/>
      ))}
    </div>
  )
}