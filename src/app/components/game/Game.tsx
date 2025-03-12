'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Bird from './Bird'
import Pipe from './Pipe'
import Score from './Score'
import PauseMenu from './PauseMenu'
import StartScreen from './StartScreen'
import ParallaxClouds from '../home/ParallaxClouds'
import useGameLoop from '../../hooks/useGameLoop'
import useCollision from '../../hooks/useCollision'
import useScore from '../../hooks/useScore'

const GRAVITY = 1200
const JUMP_FORCE = -400
const BIRD_WIDTH = 40
const BIRD_HEIGHT = 30
const PIPE_WIDTH = 60
const PIPE_GAP = 180
const PIPE_SPEED = 200
const PIPE_SPAWN_INTERVAL = 1500
const MAX_ROTATION = 30
const MIN_ROTATION = -30

type GameState = 'waiting' | 'playing' | 'paused' | 'gameover'

const Game = () => {
  const router = useRouter()
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 })
  const [bird, setBird] = useState({
    x: 0,
    y: 0,
    velocity: 0,
    rotation: 0
  })
  const [pipes, setPipes] = useState<Array<{
    id: number,
    x: number,
    topHeight: number,
    bottomHeight: number,
    passed: boolean
  }>>([])
  const [hasJumped, setHasJumped] = useState(false)
  const pipeIdRef = useRef(0)
  const lastPipeSpawnTimeRef = useRef(0)
  const { score, bestScore, resetScore, incrementScore } = useScore()
  const [showCollisions, setShowCollisions] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (gameContainerRef.current) {
        const { width, height } = gameContainerRef.current.getBoundingClientRect()
        setGameSize({ width, height })
        
        setBird(prev => ({
          ...prev,
          x: width * 0.2,
          y: height / 2 - BIRD_HEIGHT / 2
        }))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleCollision = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('gameover')
    }
  }, [gameState])

  const { checkCollisions } = useCollision({ onCollision: handleCollision })

  const resetGame = useCallback(() => {
    setBird({
      x: gameSize.width * 0.2,
      y: gameSize.height / 2 - BIRD_HEIGHT / 2,
      velocity: 0,
      rotation: 0
    })
    setPipes([])
    pipeIdRef.current = 0
    lastPipeSpawnTimeRef.current = 0
    resetScore()
    setHasJumped(false)
  }, [gameSize, resetScore])

  // Обработка прыжка
  const handleJump = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('playing')
      setHasJumped(true)
      return
    }
    
    if (gameState === 'playing') {
      setBird(prev => ({
        ...prev,
        velocity: JUMP_FORCE,
        rotation: MIN_ROTATION
      }))
      setHasJumped(true)
    }
  }, [gameState])

  const createPipe = useCallback(() => {
    const minTopHeight = 80
    const maxTopHeight = gameSize.height - PIPE_GAP - 80
    
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight) + minTopHeight)
    
    if (pipes.length > 0) {
      const lastPipe = pipes[pipes.length - 1]
      const maxDifference = gameSize.height * 0.3
      
      const minNewHeight = Math.max(minTopHeight, lastPipe.topHeight - maxDifference)
      const maxNewHeight = Math.min(maxTopHeight, lastPipe.topHeight + maxDifference)
      
      topHeight = Math.floor(Math.random() * (maxNewHeight - minNewHeight) + minNewHeight)
    }
    
    const bottomHeight = gameSize.height - topHeight - PIPE_GAP

    const newPipe = {
      id: pipeIdRef.current++,
      x: gameSize.width,
      topHeight,
      bottomHeight,
      passed: false
    }

    setPipes(prev => [...prev, newPipe])
  }, [gameSize, pipes])

  const updateGame = useCallback((deltaTime: number) => {
    if (gameState !== 'playing') return

    setBird(prev => {
      if (!hasJumped) {
        return prev
      }
      
      const newVelocity = prev.velocity + GRAVITY * deltaTime
      const newY = prev.y + newVelocity * deltaTime
      
      const velocityRatio = Math.min(Math.max(newVelocity / 1000, -1), 1)
      const newRotation = velocityRatio * (MAX_ROTATION - MIN_ROTATION) / 2 + (MAX_ROTATION + MIN_ROTATION) / 2
      
      return {
        ...prev,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation
      }
    })

    setPipes(prev => {
      const updatedPipes = prev.map(pipe => {
        const newX = pipe.x - PIPE_SPEED * deltaTime
        
        if (!pipe.passed && newX + PIPE_WIDTH < bird.x) {
          incrementScore()
          return { ...pipe, x: newX, passed: true }
        }
        
        return { ...pipe, x: newX }
      }).filter(pipe => pipe.x + PIPE_WIDTH > 0)
      
      return updatedPipes
    })

    const currentTime = Date.now()
    if (currentTime - lastPipeSpawnTimeRef.current > PIPE_SPAWN_INTERVAL) {
      createPipe()
      lastPipeSpawnTimeRef.current = currentTime
    }

    const birdRect = {
      x: bird.x,
      y: bird.y,
      width: BIRD_WIDTH,
      height: BIRD_HEIGHT
    }

    const pipeRects = pipes.map(pipe => ({
      top: {
        x: pipe.x,
        y: 0,
        width: PIPE_WIDTH,
        height: pipe.topHeight
      },
      bottom: {
        x: pipe.x,
        y: pipe.topHeight + PIPE_GAP,
        width: PIPE_WIDTH,
        height: pipe.bottomHeight
      }
    }))

    checkCollisions(birdRect, pipeRects, gameSize)
  }, [gameState, bird, pipes, hasJumped, createPipe, incrementScore, checkCollisions, gameSize])

  const { actualFps } = useGameLoop({
    isRunning: gameState === 'playing',
    onUpdate: updateGame
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowRight') {
        handleJump()
      } else if (e.code === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused')
        } else if (gameState === 'paused') {
          setGameState('playing')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState, handleJump])

  const handleResume = () => {
    setGameState('playing')
  }

  const handleRestart = () => {
    resetGame()
    setGameState('playing')
  }

  const handleExit = () => {
    router.push('/')
  }

  const handleStartGame = () => {
    resetGame()
    setGameState('playing')
  }

  const toggleCollisions = () => {
    setShowCollisions(prev => !prev)
  }

  return (
    <div 
      ref={gameContainerRef}
      className="relative w-full h-full overflow-hidden bg-blue-600"
      tabIndex={0}
      aria-label="Flappy Bird"
    >
      <ParallaxClouds />
      
      <Bird
        x={bird.x}
        y={bird.y}
        width={BIRD_WIDTH}
        height={BIRD_HEIGHT}
        rotation={bird.rotation}
        isGameStarted={gameState === 'playing'}
      />
      
      {pipes.map(pipe => (
        <Pipe
          key={pipe.id}
          x={pipe.x}
          topHeight={pipe.topHeight}
          bottomHeight={pipe.bottomHeight}
          width={PIPE_WIDTH}
          gap={PIPE_GAP}
          gameHeight={gameSize.height}
        />
      ))}
      
      <Score score={score} bestScore={bestScore} showBestScore={true} />
      
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        {gameState === 'playing' && (
          <button
            onClick={() => setGameState('paused')}
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white"
            aria-label="Pause"
            tabIndex={0}
          >
            II
          </button>
        )}
      </div>
      
      {gameState === 'waiting' && (
        <StartScreen onStart={handleStartGame} bestScore={bestScore} />
      )}
      
      {gameState === 'paused' && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleRestart}
          onExit={handleExit}
          score={score}
          bestScore={bestScore}
        />
      )}
      
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="bg-blue-800 border-4 border-blue-900 rounded-xl p-6 w-80 max-w-[90%] shadow-xl">
            <h2 className="text-4xl font-bold text-white text-center mb-4 font-jersey-direct">GAME OVER</h2>
            
            <div className="mb-6 text-white">
              <div className="flex justify-between mb-2 font-jersey-direct text-2xl">
                <span>Score:</span>
                <span className="font-bold">{score}</span>
              </div>
              <div className="flex justify-between font-jersey-direct text-2xl">
                <span>Best Score:</span>
                <span className="font-bold">{bestScore}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded transition-colors font-jersey-direct text-2xl"
                tabIndex={0}
                aria-label="Play"
              >
                Play
              </button>
              
              <button
                onClick={handleExit}
                className="w-full py-2 bg-blue-300 hover:bg-blue-400 text-white font-bold rounded transition-colors font-jersey-direct text-2xl"
                tabIndex={0}
                aria-label="Back to menu"
              >
                Back to menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game 