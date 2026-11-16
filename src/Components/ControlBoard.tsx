export interface ControlBoardProps {
    difficulty: string,
    setDifficulty: (difficulty: string) => void,
    reset: (difficulty: string) => void,
    clicks: number,
}

export default function ControlBoard({difficulty, setDifficulty, reset, clicks}: ControlBoardProps) {
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