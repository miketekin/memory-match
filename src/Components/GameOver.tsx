export default function GameOver({ref, cat_count, clicks, difficulty, reset}: {ref: HTMLDialogElement, cat_count: number, clicks: number, difficulty: string, reset: (difficulty: string) => void}) {
    
    const score = (clicks: number) => {
        const cards = cat_count * 2

        if (clicks === cards) {
            return "Perfect!!"
        } else if (clicks <= cards * 2) {
            return "Amazing!"
        } else if (clicks <= cards * 3) {
            return "Great!"
        } else if (clicks <= cards * 4) {
            return "Nice!"
        } else {
            return "Better luck next time!"
        }
        
    }
    
    return (
        <dialog ref={ref}>
            <p>You won!</p>
            <p>{clicks} clicks - {score(clicks)}</p>
            <form method="dialog">
                <button onClick={()=>reset(difficulty)}>New Game</button>
            </form>
        </dialog>
    )
}