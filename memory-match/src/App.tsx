import { useState, useEffect } from 'react';
import './App.css';


function randomize(catIds) {
  //console.log(catIds)
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
  
  function Square({catId}) {
    /*When a square gets clicked, it needs to flip over unless its already flipped over
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
    
    const [faceState, setFaceState] = useState("Down") 
    function onSquareClick() {
      if (faceState == "Down") {
        setFaceState("Up")
        //check number of squares using map.size
        if (selectedSquares.size == 0) {
          selectedSquares.set(1, catId)
        }
        else if (selectedSquares.size == 1) {
          if (catId == selectedSquares.get(1)) {
            matchedSquares.set(catId, true)
          }
        }
        else {
          selectedSquares.clear()
          selectedSquares.set(1, catId)
          //reset any unmatched squares
        }
      } else {
        setFaceState("Down")
      }
    }
    console.log(selectedSquares)
    console.log(matchedSquares)
    const basePath = "https://cataas.com/cat/"
    const params = "?type=square&position=center"
    let fullPath = basePath+catId+params
    if (faceState == "Down") {
      fullPath = "./src/assets/cat-svg.svg"
    }
    return (
      <img 
      src={fullPath}
      className="square"
      onClick={onSquareClick}
      //onClick={() => console.log("clicked")}
      ></img>
    )
  }
  /*
  What controls resetting unmatched squares?
  Need a function that adds to a map of matched squares and resets that map
  How would we reset the map? map.clear()
  How do we add to a map? map.set(key, value)

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
 let matchedSquares = new Map()
 let selectedSquares = new Map()
 function checkMatches() {
  return;
 }

  return (
    <div className="game-board">
      <div className="board-row">
        <Square catId = {swappedIds[0]}/>
        <Square catId = {swappedIds[1]}/>
        <Square catId = {swappedIds[2]}/>
        <Square catId = {swappedIds[3]}/>
      </div>
      <div className="board-row">
        <Square catId = {swappedIds[4]}/>
        <Square catId = {swappedIds[5]}/>
        <Square catId = {swappedIds[6]}/>
        <Square catId = {swappedIds[7]}/>
      </div>
      <div className="board-row">
        <Square catId = {swappedIds[8]}/>
        <Square catId = {swappedIds[9]}/>
        <Square catId = {swappedIds[10]}/>
        <Square catId = {swappedIds[11]}/>
      </div>
    </div>
  )
}


function App() {
  const [swappedIds, setSwappedIds] = useState("X");
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