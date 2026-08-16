import { useState, useEffect } from 'react';
import './App.css';

function controlBoard() {
  function onStartClick() {
    return;
  }

  function onEndClick() {
    return;
  }
  
  return(
    <div className="control-board">
        <div className="board-element">Start</div>
        <div className="board-element">End</div>
        <div className="board-element timer">0.0</div>
    </div>
  )
}


function gameBoard() {
  /*
    each square needs to return an image and
    that image needs to be click
  */
  function Square({image}) {
    return (
      <img 
      src={image}
      className="square"
      onClick={() => console.log("clicked")}
      >

      </img>
    )
  }
 
  return (
    <div className="game-board">
      <div className="board-row">
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
      </div>
      <div className="board-row">
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
      </div>
      <div className="board-row">
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
        <Square image="https://robohash.org/241.156.51.13.png"/>
      </div>
    </div>
  )
}


function App() {
  const [catIds, setCatIds] = useState(null);

  useEffect(() => {
    fetch("https://cataas.com/api/cats?limit=6")
    .then((result) => result.json())
    .then((json) => setCatIds(json))
    }, []
  );

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
        {gameBoard()}
      </div>
    </div>

  </div>
}


export default App;