import { useState, useEffect, useRef } from 'react';
import './App.css';
import ControlBoard from './Components/ControlBoard.tsx'
import GameBoard from './Components/GameBoard.tsx'
import GameOver from './Components/GameOver.tsx'
import './Components/GameOver.css'


function randomize(catIds: Array<string>) {
  let arrayCopy = [...catIds]
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

function App() {
  const [difficulty, setDifficulty] = useState('Easy')
  const [swappedIds, setSwappedIds] = useState<string[]>([""]);
  const [clicks, setClicks] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const dialog = useRef(null)

  let cat_count = 6

  useEffect(() => {
    newCats()
    }, []
  );

  useEffect(() => {
    reset(difficulty)
  }, [difficulty])

  useEffect(() => {
    gameOver && dialog.current.showModal()
  }, [gameOver])

  function reset(difficulty: string) {
    setGameOver(false)
    setClicks(0)
    newCats(difficulty)
  }

  async function newCats(difficulty = 'Easy') {
    const levels = {
      Easy: 6,
      Medium: 12,
      Hard: 18,
    }

    cat_count = levels[difficulty as keyof typeof levels] // This needs to be the number of cats for the selected difficulty level
    let catIds = []

    try {
      const catCountResponse = await fetch("https://cataass.com/api/count")
      if (!catCountResponse.ok) {
        throw new Error('Failed to get cat ids')
      }
      const countData = await catCountResponse.json()
      const availableCatCount = countData.count
      const MAX_ATTEMPTS = 3
      let attempts = 0

      while (catIds.length < cat_count && attempts < MAX_ATTEMPTS) {
        attempts++
        const skip = getRandomInt(availableCatCount - cat_count)
        const catsResponse = await fetch("https://cataass.com/api/cats?limit="+cat_count+"&skip="+skip)
        if (!catsResponse.ok) {
          throw new Error('Failed to get cats')
        }
        const catsData = await catsResponse.json()

        for (const entry of catsData) {
          if (entry.mimetype !== 'image/gif' && catIds.length < cat_count) {
            catIds.push(entry.id)
          }
        }
      }
    } catch (error) {
      console.log('error', error)
    }

    await Promise.all(catIds)
    catIds = catIds.concat(catIds)
    catIds = randomize(catIds)
    setSwappedIds([...catIds])
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
      <GameOver ref={dialog} cat_count={cat_count} clicks={clicks} reset={(difficulty) => reset(difficulty)}/>

      <div>
        {ControlBoard({reset, difficulty, setDifficulty, clicks})}
      </div>
      <div>
        {GameBoard({swappedIds, clicks, setClicks, setGameOver})}
      </div>
    </div>

  </div>
  )
}


export default App;