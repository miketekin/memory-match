import catSvg from '../assets/cat-svg.svg'

export interface SquareModel {
    catId: string,
    flipped: boolean,
    matched: boolean,
    blobPath: string,
}

export interface SquareProps {
    index: number,
    model: SquareModel,
    onClick: (index: number, catId: string) => void,
}

export default function Square({ index, model, onClick }: SquareProps) {
    let {catId, flipped, matched, blobPath} = model

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