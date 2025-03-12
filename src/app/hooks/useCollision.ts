'use client'

import { useCallback } from 'react'

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

type UseCollisionProps = {
  onCollision?: () => void
}

const useCollision = ({ onCollision }: UseCollisionProps = {}) => {
  const checkCollision = useCallback((rect1: Rect, rect2: Rect): boolean => {
    const adjustedRect1 = {
      x: rect1.x + rect1.width * 0.1,
      y: rect1.y + rect1.height * 0.1,
      width: rect1.width * 0.8,
      height: rect1.height * 0.8
    }
    
    const adjustedRect2 = {
      x: rect2.x + rect2.width * 0.05,
      y: rect2.y,
      width: rect2.width * 0.9,
      height: rect2.height
    }
    
    return (
      adjustedRect1.x < adjustedRect2.x + adjustedRect2.width &&
      adjustedRect1.x + adjustedRect1.width > adjustedRect2.x &&
      adjustedRect1.y < adjustedRect2.y + adjustedRect2.height &&
      adjustedRect1.y + adjustedRect1.height > adjustedRect2.y
    )
  }, [])

  const checkCollisions = useCallback((
    birdRect: Rect,
    pipes: { top: Rect; bottom: Rect }[],
    screenBounds: { width: number; height: number }
  ): boolean => {
    if (birdRect.y <= 0 || birdRect.y + birdRect.height >= screenBounds.height - 16) {
      onCollision?.()
      return true
    }

    for (const pipe of pipes) {
      if (checkCollision(birdRect, pipe.top) || checkCollision(birdRect, pipe.bottom)) {
        onCollision?.()
        return true
      }
    }

    return false
  }, [checkCollision, onCollision])

  return { checkCollision, checkCollisions }
}

export default useCollision 