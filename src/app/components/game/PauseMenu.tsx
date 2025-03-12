'use client'

type PauseMenuProps = {
  onResume: () => void
  onRestart: () => void
  onExit: () => void
  score: number
  bestScore: number
}

const PauseMenu = ({ onResume, onRestart, onExit, score, bestScore }: PauseMenuProps) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center">
      <div className="bg-blue-800 border-4 border-blue-900 rounded-xl p-6 w-80 max-w-[90%] shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-4 font-jersey-direct text-4xl">Pause</h2>
        
        <div className="mb-6 text-white font-jersey-direct text-2xl">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex justify-between">
            <span>Best Score:</span>
            <span className="font-bold">{bestScore}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors font-jersey-direct text-xl"
            tabIndex={0}
            aria-label="Continue"
          >
            Continue
          </button>
          
          <button
            onClick={onRestart}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition-colors font-jersey-direct text-xl"
            tabIndex={0}
            aria-label="Restart"
          >
            Restart
          </button>
          
          <button
            onClick={onExit}
            className="w-full py-2 bg-blue-300 hover:bg-blue-400 text-white font-bold rounded transition-colors font-jersey-direct text-xl"
            tabIndex={0}
            aria-label="Back to menu"
          >
            Back to menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default PauseMenu 