/*
When a square gets clicked, it needs to flip over unless its already flipped over
If a square is already flipped over and another square is clicked then it needs to
be evaluated for a match
If two squares have already been flipped over and a third is clicked, any non matching
squares need to be flipped back over

Need to have a map of square status'
The map needs to contain the squares position, state, id, and if a match has been found
  Maybe this neesd to be split up into several maps
  One map where the key is the id and the value is the matched status
  One map where the key is the id and the value is the flipped status
  We don't actually need to track position
When a square is clicked, check to see its state, if it's already flipped,
do nothing
If it's not already flipped, determine how many unmatched flipped squares there are
This set of unmatched flipped squares should be a second map
It will only ever contain 0, 1, or 2 elements
When determining how many unmatched flipped squares there are, if that number is 0 or 1
Add this square to the map
Once the map reaches two squares, perform an evaluation that would mark them as matched if
their ids match
If that number is 2, reset any unmatched+flipped squares and flip the newly clicked one
The square states must be tracked above the square function
The necessary operations would: flip, reset, mark match

Finally, we need something to determine if the final square is flipped - if so, stop
the timer and calculate the score (may cut this score/timer functionality depending on time)

What controls the actual flip action? useState hook
*/

/*
The process: add squares to the selectedSquares map until it has two entries
If this is the first square, simply add it to the selectedSquares map
If this is the second square, check if they are a match
  if they are a match, update the squares dictionary
If this is the third square, clear the selectedSquares map,
  and add the new square, reset any unmatched squares

Operations:
Check the number of squares in the selectedSquares map using map.size
Check if the ids of the squares match
Check the matchedSquares map
Update the matchedSquares map
Clear the selectedSquares map
Clear the matchedSquares map
*/

import { useState, useEffect } from 'react';
import './App.css';


function randomize(catIds) {
  console.log("RANDOMIZE")
  let arrayCopy = catIds
  for (let i = 11; i >= 0; i--) {
    //console.log([i, arrayCopy])
    let tmp = arrayCopy[i]
    let randomInt = getRandomInt(i)
    arrayCopy[i] = arrayCopy[randomInt]
    arrayCopy[randomInt] = tmp
  }
  //console.log(arrayCopy)
  return arrayCopy;
}


function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


function controlBoard() {
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
  const [activity, setActivity] = useState("Start");
  let buttonClass = "start-button"
  const [timer, setTimer] = useState(false);
  const time = 0;
  function onActivityClick() {
    if (activity == "Start") {
      setActivity("Stop")
      setTimer(true)
    }
    else {
      setActivity("Start")
      setTimer(false)
    }
  }

  if (activity == "Start") {
    buttonClass = "board-element start-button"
  }
  else {
    buttonClass = "board-element stop-button"
  }
  
  return(
    <div className="control-board">
        <div className={buttonClass} onClick={onActivityClick}>{activity}</div>
        <div className="board-element timer">Time: 0.0</div>
        <div className="board-element timer">Score: 0.0</div>
    </div>
  )
}

function gameBoard({swappedIds}) {
  console.log(["gameBoard", swappedIds])

  function Square({ index, catId, flipped, matched, onClick }) {
    //const [faceState, setFaceState] = useState("Down") 
    console.log(["Square Function", index])
    const basePath = "https://cataas.com/cat/"
    const params = "?type=square&position=center"
    let fullPath = basePath+catId+params
    if (!flipped && !matched) {
      fullPath = "./src/assets/cat-svg.svg"
    }
    // if (faceState == "Down") {
    //   fullPath = "./src/assets/cat-svg.svg"
    // }
    console.log(["square log", "index", index, "catid", catId])
    return (
      <img 
      src={fullPath}
      className="square"
      onClick={() => onClick(index, catId)}
      //onClick={() => console.log("clicked")}
      ></img>
    )
  }


  function onSquareClick(index, id) {
    console.log(["onSquareClick", index, id])
    let tempSquares = [...squares]
    let flippedSquares = []
    console.log(flippedSquares)
    //Check to see if the current square is face up
    if (tempSquares[index]['flipped'] || tempSquares[index]['matched']) {
      return;
    }
    else {
      //Create a list of flipped squares
      for (let i = 0; i < tempSquares.length; ++i) {
        if (tempSquares[i]['flipped']) {
          console.log(["tempSquares[i]", tempSquares[i]])
          flippedSquares.push(i)
        }
      }      
      //If this is the first one, flip it
      if (flippedSquares.length == 0) {
        tempSquares[index]['flipped'] = true
      }

      //If one already exists, check if there's a match
      else if (flippedSquares.length == 1) {
        //If there is only one flipped, go ahead and flip this one
        //tempSquares[index]['flipped'] = true

        //If there is a match
        if (tempSquares[flippedSquares[0]]['id'] == id) {
          tempSquares[flippedSquares[0]]['matched'] = true
          tempSquares[index]['matched'] = true
        }
        else {
          tempSquares[index]['flipped'] = true
        }
      }
      //If there are already two, flip the others over and flip 
      else {
        tempSquares[flippedSquares[0]]['flipped'] = false
        tempSquares[flippedSquares[1]]['flipped'] = false
        tempSquares[index]['flipped'] = true
      }
    }
    console.log(tempSquares)
    setSquares(tempSquares)
  }

  let [squares, setSquares] = useState([])

  useEffect(() => {
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
  console.log(["swappedIds", swappedIds, "squares", squares])
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

  const [swappedIds, setSwappedIds] = useState();
  const skipMax: number = 1975;
  const skip: number = getRandomInt(skipMax)
  
  useEffect(() => {
    fetch("https://cataas.com/api/cats?limit=6&skip="+skip)
    .then((result) => result.json())
    .then((json) => json.map(({id}) => id))
    .then((catIds) => catIds.concat(catIds))
    .then((catIds) => setSwappedIds(randomize(catIds)))
    }, []
  );

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
        {controlBoard()}
      </div>
      <div className="game-board">
        {gameBoard({swappedIds})}
      </div>
    </div>

  </div>
  )
}


export default App;