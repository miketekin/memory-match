import { useState, useEffect } from 'react';
import './App.css';
import catSvg from './assets/cat-svg.svg'


function randomize(catIds: Array<string>) {
  let arrayCopy = catIds
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


function controlBoard(reset: () => void) {
  let buttonClass = "reset-button"

  function onActivityClick() {
    reset()
  }
  
  return(
    <div className={buttonClass} onClick={onActivityClick}>Reset</div>
  )
}


function gameBoard({swappedIds}: { swappedIds: Array<string> }) {

  function Square({ index, catId, flipped, matched, blobPath, onClick }: {index: number, catId: string, flipped: boolean, matched: boolean, blobPath: string, onClick: (index: number, catId: string) => void}) {
    if (!flipped && !matched) {
      blobPath = catSvg
    }

    return (
      <img 
      src={blobPath}
      className="square"
      onClick={() => onClick(index, catId)}
      ></img>
    )
  }

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
        if (tempSquares[flippedSquares[0]]['id'] == id) {
          tempSquares[flippedSquares[0]]['matched'] = true
          tempSquares[index]['matched'] = true
        }
      }
      //If there are already two, clear the existing flips and flip the clicked one
      else {
        tempSquares[flippedSquares[0]]['flipped'] = false
        tempSquares[flippedSquares[1]]['flipped'] = false
        tempSquares[index]['flipped'] = true
      }
    }

    setSquares(tempSquares)
  }

  interface item {
    id: string,
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
          id: swappedIds[id],
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

  return (
    <div className="game-board">
      <div className="board-row">
        <Square index = {0} {...squares[0]} onClick = {onSquareClick}/>
        <Square index = {1} {...squares[1]} onClick = {onSquareClick}/>
        <Square index = {2} {...squares[2]} onClick = {onSquareClick}/>
        <Square index = {3} {...squares[3]} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {4} {...squares[4]} onClick = {onSquareClick}/>
        <Square index = {5} {...squares[5]} onClick = {onSquareClick}/>
        <Square index = {6} {...squares[6]} onClick = {onSquareClick}/>
        <Square index = {7} {...squares[7]} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {8} {...squares[8]} onClick = {onSquareClick}/>
        <Square index = {9} {...squares[9]} onClick = {onSquareClick}/>
        <Square index = {10} {...squares[10]} onClick = {onSquareClick}/>
        <Square index = {11} {...squares[11]} onClick = {onSquareClick}/>
      </div>
    </div>
  )
}




function App() {
  const [swappedIds, setSwappedIds] = useState<string[]>([""]);
  const skipMax: number = 1975;
  const skip: number = getRandomInt(skipMax)
  
  useEffect(() => {
    fetch("https://cataas.com/api/cats?limit=6&skip="+skip)
    .then((result) => result.json())
    .then((json) => json.map(({id}: {id: string}) => id))
    .then((catIds) => catIds.concat(catIds))
    .then((catIds) => setSwappedIds(randomize(catIds)))
    
    
  }, []
  );

  function reset() {
    let newSwappedIds = [...swappedIds]
    setSwappedIds(randomize(newSwappedIds))
  }

  return(
  <div className="App">
    <header className="App-header">
      <p>
        C a t s
      </p>
      <p className="small">
        Memory matching game
      </p>
    </header>

    <div className="App-body">
      <div>
        {controlBoard(reset)}
      </div>
      <div className="game-board">
        {gameBoard({swappedIds})}
      </div>
    </div>

  </div>
  )
}


export default App;