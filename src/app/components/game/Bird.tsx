'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

type BirdProps = {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  isGameStarted: boolean
}

const Bird = ({ x, y, width, height, rotation, isGameStarted }: BirdProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const birdRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (birdRef.current) {
      birdRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`
    }
  }, [x, y, rotation])

  return (
    <div 
      ref={birdRef}
      className="absolute will-change-transform"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        zIndex: 10
      }}
      aria-label="Flappy Bird"
    >
      <Image
        src="/images/flappy-bird.png.png"
        alt="Flappy Bird"
        width={width}
        height={height}
        className={`w-full h-full object-contain select-none pointer-events-none ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        priority
      />
    </div>
  )
}

export default Bird 