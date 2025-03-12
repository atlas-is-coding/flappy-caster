'use client'

import Game from '../../components/game/Game'

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center">
      <div className="w-full h-screen max-w-3xl mx-auto">
        <Game />
      </div>
    </div>
  )
} 