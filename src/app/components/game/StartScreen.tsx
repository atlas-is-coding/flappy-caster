'use client'

import Link from 'next/link'

type StartScreenProps = {
  onStart: () => void
  bestScore: number
}

const StartScreen = ({ onStart, bestScore }: StartScreenProps) => {
  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-30 flex items-center justify-center">
      <div className="bg-blue-800/90 border-4 border-blue-900 rounded-xl p-6 w-80 max-w-[90%] shadow-xl">
        <h2 className="text-4xl font-bold text-white text-center mb-4 font-jersey-direct">FLAPPY CASTER</h2>
        
        {bestScore > 0 && (
          <div className="mb-4 text-white text-center">
            <div className=""><span className='font-jersey-direct'>Best Score: {bestScore}</span></div>
          </div>
        )}
        
        <div className="text-white text-center mb-6 font-jetbrains text-xs">
          Press <span className="">SPACE</span> or <span className="">UP ARROW</span> to play
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded transition-colors font-jersey-direct text-xl"
            tabIndex={0}
            aria-label="Play"
          >
            Play
          </button>
          
          <Link href="/" className="block">
            <button
              className="w-full py-2 bg-blue-300 hover:bg-blue-400 text-white font-bold rounded transition-colors font-jersey-direct text-xl"
              tabIndex={0}
              aria-label="Back to menu"
            >
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StartScreen 