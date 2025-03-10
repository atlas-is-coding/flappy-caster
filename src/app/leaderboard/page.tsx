'use client'

import Link from 'next/link'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center">
      <h1 className="text-7xl font-bold text-white mb-8 font-jersey-direct">Leaderboard</h1>
      <Link 
        href="/"
        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 font-jersey-direct text-2xl"
        tabIndex={0}
        aria-label="Back"
      >
        Back
      </Link>
    </div>
  )
} 