'use client'

import { useRef, useEffect, useState } from 'react'

type UseGameLoopProps = {
  fps?: number
  isRunning: boolean
  onUpdate: (deltaTime: number) => void
}

const useGameLoop = ({ fps = 360, isRunning, onUpdate }: UseGameLoopProps) => {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const fpsInterval = useRef<number>(1000 / fps)
  const [actualFps, setActualFps] = useState<number>(0)
  
  const fpsCounterRef = useRef<{
    frames: number,
    lastFpsUpdate: number
  }>({
    frames: 0,
    lastFpsUpdate: 0
  })

  useEffect(() => {
    fpsInterval.current = 1000 / fps
  }, [fps])

  useEffect(() => {
    if (!isRunning) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
      previousTimeRef.current = null
      return
    }

    const animate = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time
        fpsCounterRef.current.lastFpsUpdate = time
      }

      const deltaTime = time - previousTimeRef.current
      
      fpsCounterRef.current.frames++
      if (time - fpsCounterRef.current.lastFpsUpdate >= 1000) {
        setActualFps(fpsCounterRef.current.frames)
        fpsCounterRef.current.frames = 0
        fpsCounterRef.current.lastFpsUpdate = time
      }

      if (deltaTime >= fpsInterval.current) {
        previousTimeRef.current = time - (deltaTime % fpsInterval.current)
        onUpdate(deltaTime / 1000)
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isRunning, onUpdate])

  return { actualFps }
}

export default useGameLoop 