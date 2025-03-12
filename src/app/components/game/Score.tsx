'use client'

type ScoreProps = {
  score: number
  bestScore: number
  showBestScore?: boolean
}

const Score = ({ score, bestScore, showBestScore = false }: ScoreProps) => {
  return (
    <div className="absolute top-4 left-4 z-20 font-mono text-white text-shadow-lg select-none">
      <div className="text-3xl font-bold font-jersey-direct">SCORE: {score}</div>
      {showBestScore && (
        <div className="text-2xl mt-1 flex items-center">
          <span className="mr-1 font-jersey-direct">BEST:</span>
          <span className={`font-bold font-jersey-direct ${score > 0 && score === bestScore ? 'text-yellow-300' : ''}`}>
            {bestScore}
          </span>
          {score > 0 && score === bestScore && (
            <span className="ml-2 font-jersey-direct text-yellow-300 text-xs animate-pulse">NEW!</span>
          )}
        </div>
      )}
    </div>
  )
}

export default Score 