'use client'

import { useState, useEffect, useCallback } from 'react'

const BEST_SCORE_KEY = 'flappy-caster-best-score'

const useScore = () => {
  const [score, setScore] = useState<number>(0)
  const [bestScore, setBestScore] = useState<number>(0)

  useEffect(() => {
    const savedBestScore = localStorage.getItem(BEST_SCORE_KEY)
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10))
    }
  }, [])

  const resetScore = useCallback(() => {
    setScore(0)
  }, [])

  const incrementScore = useCallback(() => {
    setScore(prevScore => {
      const newScore = prevScore + 1
      
      if (newScore > bestScore) {
        setBestScore(newScore)
        localStorage.setItem(BEST_SCORE_KEY, newScore.toString())
      }
      
      return newScore
    })
  }, [bestScore])

  return {
    score,
    bestScore,
    resetScore,
    incrementScore
  }
}

export default useScore 