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
  /* how does a timer work?
    when the timers state is true, it increments by 1 every second
    how do we increment by 1 every second?
    We could capture the start time then have the timer evaluate the current time
    minus the start time and rerender that component every time it changes
    how do we capture the start time?
    Date.now() captures epoch time including ms
    divide by 1000 to get seconds
    
    while the start state is true, run date.now() every second and subtract from the first capture?
    If we're already running something every second, then we could just increment using that

  */ 
  //const [activity, setActivity] = useState("Start");
  //const [activity, setActivity] = useState("Reset");

  //let buttonClass = "start-button"
  let buttonClass = "reset-button"
  //const [timer, setTimer] = useState(false);
  //const time = 0;

  
  function onActivityClick() {
    // console.log("onActivityClick")
    // if (activity == "Start") {
    //   setActivity("Stop")
    //   setTimer(true)
    // }
    // else {
    //   setActivity("Start")
    //   setTimer(false)
    // }
    reset()
  }

  // if (activity == "Start") {
  //   buttonClass = "board-element start-button"
  // }
  // else {
  //   buttonClass = "board-element stop-button"
  // }
  
  return(
    <div className={buttonClass} onClick={onActivityClick}>Reset</div>
  )
  // return(
  //   <div className="control-board">
  //       <div className={buttonClass} onClick={onActivityClick}>{activity}</div>
  //       <div className="board-element timer">Time: 0.0</div>
  //       <div className="board-element timer">Score: 0.0</div>
  //   </div>
  // )
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
  console.log(squares)

  return (
    <div className="game-board">
      <div className="board-row">
        <Square index = {0} catId = {squares[0]['id']} flipped = {squares[0]['flipped']} matched = {squares[0]['matched']} blobPath = {squares[0]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {1} catId = {squares[1]['id']} flipped = {squares[1]['flipped']} matched = {squares[1]['matched']} blobPath = {squares[1]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {2} catId = {squares[2]['id']} flipped = {squares[2]['flipped']} matched = {squares[2]['matched']} blobPath = {squares[2]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {3} catId = {squares[3]['id']} flipped = {squares[3]['flipped']} matched = {squares[3]['matched']} blobPath = {squares[3]['blobPath']} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {4} catId = {squares[4]['id']} flipped = {squares[4]['flipped']} matched = {squares[4]['matched']} blobPath = {squares[4]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {5} catId = {squares[5]['id']} flipped = {squares[5]['flipped']} matched = {squares[5]['matched']} blobPath = {squares[5]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {6} catId = {squares[6]['id']} flipped = {squares[6]['flipped']} matched = {squares[6]['matched']} blobPath = {squares[6]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {7} catId = {squares[7]['id']} flipped = {squares[7]['flipped']} matched = {squares[7]['matched']} blobPath = {squares[7]['blobPath']} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {8} catId = {squares[8]['id']} flipped = {squares[8]['flipped']} matched = {squares[8]['matched']} blobPath = {squares[8]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {9} catId = {squares[9]['id']} flipped = {squares[9]['flipped']} matched = {squares[9]['matched']} blobPath = {squares[9]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {10} catId = {squares[10]['id']} flipped = {squares[10]['flipped']} matched = {squares[10]['matched']} blobPath = {squares[10]['blobPath']} onClick = {onSquareClick}/>
        <Square index = {11} catId = {squares[11]['id']} flipped = {squares[11]['flipped']} matched = {squares[11]['matched']} blobPath = {squares[11]['blobPath']} onClick = {onSquareClick}/>
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
    console.log("reset")
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