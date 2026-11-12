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


function controlBoard(reset: (difficulty: string) => void, difficulty: string, setDifficulty: (difficulty: string) => void, clicks: number) {
  let buttonClass = "reset-button"
  
  return(
    <div className='control-board'>
      <label className='score'>Count: {clicks}</label>
      <select className='difficulty-selector' value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button className={buttonClass} onClick={() => reset(difficulty)}>Reset</button>
      </div>
  )
}


function gameBoard({swappedIds, clicks, setClicks}: { swappedIds: Array<string>, clicks: number, setClicks: (clicks: number) => void}) {

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
        if (tempSquares[flippedSquares[0]]['catId'] == id) {
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
        <Square index={itemIndex} {...squares[itemIndex]} onClick={onSquareClick}/>
      ))}
    </div>
  )
}




function App() {
  const [difficulty, setDifficulty] = useState('Easy')
  const [swappedIds, setSwappedIds] = useState<string[]>([""]);
  const [clicks, setClicks] = useState(0)

  

  useEffect(() => {
    console.log("getting new cats")
    newCats()
    }, []
  );

  useEffect(() => {
    reset(difficulty)
  }, [difficulty])

  function reset(difficulty: string) {
    setClicks(0)
    newCats(difficulty)
  }

  async function newCats(difficulty = 'Easy') {
    const levels = {
      Easy: 6,
      Medium: 12,
      Hard: 18,
    }

    const CATS = levels[difficulty as keyof typeof levels] // This needs to be the number of cats for the selected difficulty level
    let catIds = []

    try {
      const catCountResponse = await fetch("https://cataas.com/api/count")
      const countData = await catCountResponse.json()
      const totalCats = countData.count
      const MAX_ATTEMPTS = 3
      let attempts = 0

      while (catIds.length < CATS && attempts < MAX_ATTEMPTS) {
        attempts++
        const skip = getRandomInt(totalCats - CATS)
        const catsResponse = await fetch("https://cataas.com/api/cats?limit="+CATS+"&skip="+skip)
        const catsData = await catsResponse.json()

        for (const entry of catsData) {
          if (entry.mimetype !== 'image/gif' && catIds.length < CATS) {
            catIds.push(entry.id)
          }
        }
      }
    } catch (error) {
      console.log(catIds)
    }

    const catCards = catIds.concat(catIds)
    setSwappedIds(randomize(catCards))


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
        {controlBoard(reset, difficulty, setDifficulty, clicks)}
      </div>
      <div>
        {gameBoard({swappedIds, clicks, setClicks})}
      </div>
    </div>

  </div>
  )
}


export default App;