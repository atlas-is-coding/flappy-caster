'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const AnimatedBird = () => {
  const [position, setPosition] = useState({ y: 0 })
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    let animationFrameId: number
    let startTime: number | null = null
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      
      const newY = Math.sin(elapsed / 500) * 15
      setPosition({ y: newY })
      
      if (elapsed % 2000 < 10 && elapsed > 10) {
        setDirection(prev => prev * -1)
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div 
      className="relative inline-block"
      style={{ 
        transform: `translateY(${position.y}px) scaleX(${direction})`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <Image 
        src="/images/flappy-bird.png.png" 
        alt="Flappy Bird" 
        width={120} 
        height={120}
        className="pixelated"
        priority
      />
    </div>
  )
}

export default AnimatedBird 