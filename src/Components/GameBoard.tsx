import { useState, useEffect, useRef } from 'react'
import Square from './Square.tsx'
import './GameBoard.css'

export interface GameBoardProps {
    swappedIds: Array<string>,
    clicks: number,
    setClicks: (clicks:number) => void,
    setGameOver: (gameOver: boolean) => void,
}

export default function GameBoard({swappedIds, clicks, setClicks, setGameOver}: GameBoardProps) {

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

  interface item {
    catId: string,
    matched: boolean,
    flipped: boolean,
    blobPath: string
  }

  let [squares, setSquares] = useState<item[]>([])


  const basePath = "https://cataas.com/cat/"
  const params = "?type=square&position=center"

  useEffect(() => {
    squares = []
    for (const id in swappedIds) {
      console.log("swapped", swappedIds[id])
      let blobPath = null
      fetch(basePath+swappedIds[id]+params)
      .then(res=>res.blob())
      .then(blob=>{
        blobPath = URL.createObjectURL(blob)
        const item = {
          catId: swappedIds[id],
          matched: false,
          flipped: false,
          blobPath: blobPath
        }
        squares.push(item)
        let tempSquares = [...squares]
        setSquares(tempSquares)
      })
    }
  }, [swappedIds]);


  if (squares.length < 12) {
    return (
      <div>Loading</div>
    )
  }
    console.log('rendering')

  return (
    <div className="game-board">
      {squares.map((item, itemIndex) => (
        <Square index={itemIndex} model={squares[itemIndex]} onClick={onSquareClick}/>
      ))}
    </div>
  )
}