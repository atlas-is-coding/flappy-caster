'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    handleResize()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [scrolled])

  const imageWidth = 350
  const numberOfImages = Math.max(3, Math.ceil((windowWidth || 1200) / imageWidth) + 1)
  
  const images = Array.from({ length: numberOfImages }, (_, index) => index)

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-blue-500/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-20 py-2 flex justify-between items-center relative">
        <div 
          ref={containerRef}
          className="absolute left-0 top-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div className="w-full h-16 relative">
            <div className="flex absolute top-0 left-0 w-full">
              {images.map((index) => (
                <Image 
                  key={index}
                  src="/images/navbar.png" 
                  alt="Navbar clouds" 
                  width={imageWidth}
                  height={64}
                  className="select-none"
                  priority={index < 3}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="invisible flex-1">Placeholder</div>
        
        <div className="flex items-center z-10 ml-auto bg-white bg-opacity-30 rounded-full p-1 px-3 border-2 border-white shadow-md">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
            <span className="w-7 h-7 bg-black rounded-full border-2 border-white"></span>
          </div>
          <span className="text-2xl text-black font-medium font-jersey-direct">username</span>
        </div>
      </div>
    </header>
  )
}

export default Header 