import { useState, useEffect } from 'react';
import './App.css';


function randomize(catIds: Array<string>) {
  //console.log("randomize")
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
  const [activity, setActivity] = useState("Reset");

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
    <div className={buttonClass} onClick={onActivityClick}>{activity}</div>
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
  //console.log(["gameBoard", swappedIds])

  function Square({ index, catId, flipped, matched, onClick }: {index: number, catId: string, flipped: boolean, matched: boolean, onClick: (index: number, catId: string) => void}) {
    //console.log(["Square Function", index, catId])
    const basePath = "https://cataas.com/cat/"
    const params = "?type=square&position=center"
    let fullPath = basePath+catId+params
    if (!flipped && !matched) {
      fullPath = "./src/assets/cat-svg.svg"
    }
    return (
      <img 
      src={fullPath}
      className="square"
      onClick={() => onClick(index, catId)}
      //onClick={() => console.log("clicked")}
      ></img>
    )
  }

  function onSquareClick(index: number, id: string) {
    //console.log(["onSquareClick", index, id])
    let tempSquares = [...squares]
    let flippedSquares: Array<number> = []
    //console.log(["flippedSquares Starting", flippedSquares])
    //console.log(["tempSquares Starting", tempSquares])

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
    //console.log(["flippedSquares Final", flippedSquares])
    //console.log(["tempSquares Final", tempSquares])
    setSquares(tempSquares)
  }

  interface item {
    id: string,
    matched: boolean,
    flipped: boolean
  }

  let [squares, setSquares] = useState<item[]>([])

  useEffect(() => {
    console.log("setSquares useEffect")
    squares = []
    for (const id in swappedIds) {
      const item = {
        id: swappedIds[id],
        matched: false,
        flipped: false
      }
      squares.push(item)
    }
    
    setSquares(squares)
    }, [swappedIds]
  );


  if (squares.length < 11) {
    return (
      <div>Loading</div>
    )
  }
  console.log(squares)

  return (
    <div className="game-board">
      <div className="board-row">
        <Square index = {0} catId = {squares[0]['id']} flipped = {squares[0]['flipped']} matched = {squares[0]['matched']} onClick = {onSquareClick}/>
        <Square index = {1} catId = {squares[1]['id']} flipped = {squares[1]['flipped']} matched = {squares[1]['matched']} onClick = {onSquareClick}/>
        <Square index = {2} catId = {squares[2]['id']} flipped = {squares[2]['flipped']} matched = {squares[2]['matched']} onClick = {onSquareClick}/>
        <Square index = {3} catId = {squares[3]['id']} flipped = {squares[3]['flipped']} matched = {squares[3]['matched']} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {4} catId = {squares[4]['id']} flipped = {squares[4]['flipped']} matched = {squares[4]['matched']} onClick = {onSquareClick}/>
        <Square index = {5} catId = {squares[5]['id']} flipped = {squares[5]['flipped']} matched = {squares[5]['matched']} onClick = {onSquareClick}/>
        <Square index = {6} catId = {squares[6]['id']} flipped = {squares[6]['flipped']} matched = {squares[6]['matched']} onClick = {onSquareClick}/>
        <Square index = {7} catId = {squares[7]['id']} flipped = {squares[7]['flipped']} matched = {squares[7]['matched']} onClick = {onSquareClick}/>
      </div>
      <div className="board-row">
        <Square index = {8} catId = {squares[8]['id']} flipped = {squares[8]['flipped']} matched = {squares[8]['matched']} onClick = {onSquareClick}/>
        <Square index = {9} catId = {squares[9]['id']} flipped = {squares[9]['flipped']} matched = {squares[9]['matched']} onClick = {onSquareClick}/>
        <Square index = {10} catId = {squares[10]['id']} flipped = {squares[10]['flipped']} matched = {squares[10]['matched']} onClick = {onSquareClick}/>
        <Square index = {11} catId = {squares[11]['id']} flipped = {squares[11]['flipped']} matched = {squares[11]['matched']} onClick = {onSquareClick}/>
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