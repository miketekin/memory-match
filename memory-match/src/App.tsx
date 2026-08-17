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
    const basePath = "https://cataas.com/cat/"
    const params = "?type=square&position=center"
    const fullPath = basePath+catId+params
    return (
      <img 
      src={fullPath}
      className="square"
      onClick={() => console.log("clicked")}
      ></img>
    )
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