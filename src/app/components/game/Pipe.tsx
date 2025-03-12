'use client'

import { useRef, useEffect } from 'react'

type PipeProps = {
  x: number
  topHeight: number
  bottomHeight: number
  width: number
  gap: number
  gameHeight: number
}

const Pipe = ({ x, topHeight, bottomHeight, width, gap, gameHeight }: PipeProps) => {
  const pipeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pipeRef.current) {
      pipeRef.current.style.transform = `translateX(${x}px)`
    }
  }, [x])

  return (
    <div 
      ref={pipeRef}
      className="absolute top-0 left-0 h-full will-change-transform"
      style={{ 
        transform: `translateX(${x}px)`,
        width: `${width}px`,
        zIndex: 5
      }}
      aria-label="Pipe"
    >
      <div 
        className="absolute top-0 w-full bg-sky-400 border-b-4 border-r-4 border-l-4 border-sky-700"
        style={{ 
          height: `${topHeight}px`,
          borderBottomWidth: '4px'
        }}
      >
        <div className="absolute bottom-0 left-0 w-full h-6 bg-sky-500 border-b-4 border-sky-700" style={{ transform: 'translateY(100%)' }}></div>
      </div>
      
      <div 
        className="absolute w-full bg-sky-400 border-t-4 border-r-4 border-l-4 border-sky-700"
        style={{ 
          top: `${topHeight + gap}px`,
          height: `${bottomHeight}px`,
          borderTopWidth: '4px'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-6 bg-sky-500 border-t-4 border-sky-700" style={{ transform: 'translateY(-100%)' }}></div>
      </div>
      
      <div 
        className="absolute"
        style={{ 
          top: `${topHeight}px`,
          height: `${gap}px`,
          width: '100%'
        }}
      ></div>
    </div>
  )
}

export default Pipe 