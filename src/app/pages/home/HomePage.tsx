'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import ParallaxClouds from '../../components/ParallaxClouds'
import AnimatedBird from '../../components/AnimatedBird'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-blue-600 relative overflow-hidden">
      <ParallaxClouds />
      <Header />
      
      <main className="container mx-auto px-4 pt-20 flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-7xl font-bold text-white mb-4 font-jersey-direct">
          Flappy Caster
        </p>
        <p className="font-jetbrains text-xl text-white mb-12 max-w-md">
          Play and become the best Flappy in the whole Warpcast
        </p>
        
        <div className="mb-12">
          <AnimatedBird />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/leaderboard"
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-2xl min-w-[200px] flex items-center justify-center font-jersey-direct"
            tabIndex={0}
            aria-label="Leaderboard"
          >
            Leaderboard
          </Link>
          <Link 
            href="/play"
            className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-2xl min-w-[200px] flex items-center justify-center font-jersey-direct"
            tabIndex={0}
            aria-label="Play"
          >
            Play
          </Link>
        </div>
      </main>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white opacity-70">
        <span className="font-jersey-direct text-xl">
          by: <a 
            href="https://github.com/atlas-is-coding" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-blue-200 underline transition-colors duration-300 font-medium"
            aria-label="Github: atlas-is-coding"
          >
            atlas-is-coding
          </a>
        </span>
      </footer>
    </div>
  )
}

export default HomePage 