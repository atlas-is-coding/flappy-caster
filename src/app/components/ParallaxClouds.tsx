'use client'

import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'

type CloudProps = {
  id: number
  src: string
  alt: string
  width: number
  height: number
  speed: number
  initialLeft: number
  top: number
  opacity: number
  zIndex: number
  onReposition: (id: number, newPosition: { left: number, top: number, width: number, height: number }) => void
}

type CloudPosition = {
  left: number
  top: number
  width: number
  height: number
}

const Cloud = ({ 
  id, 
  src, 
  alt, 
  width, 
  height, 
  speed, 
  initialLeft, 
  top, 
  opacity, 
  zIndex,
  onReposition 
}: CloudProps) => {
  const [position, setPosition] = useState(initialLeft)
  const [cloudTop, setCloudTop] = useState(top)
  const [isVisible, setIsVisible] = useState(true)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastRepositionTime = useRef<number>(0)
  const cloudRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      
      const newPosition = initialLeft - (elapsed * speed / 1000)
      
      if (newPosition < -10) {
        setIsVisible(false)
      }
      
      if (newPosition < -20) {
        startTimeRef.current = timestamp
        
        const newLeft = 105
        setPosition(newLeft)
        
        let newTop = 0
        if (zIndex === 1) {
          newTop = 5 + Math.random() * 25
        } else if (zIndex === 2) {
          newTop = 35 + Math.random() * 30
        } else {
          newTop = 70 + Math.random() * 20
        }
        
        setCloudTop(newTop)
        
        onReposition(id, { 
          left: newLeft, 
          top: newTop, 
          width: width / 10,
          height: height / 10 
        })
        
        lastRepositionTime.current = timestamp
        
        setTimeout(() => {
          setIsVisible(true)
        }, 50)
      } else {
        setPosition(newPosition)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    if (isFirstRender.current) {
      isFirstRender.current = false
      
      setPosition(initialLeft)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [id, initialLeft, speed, width, height, zIndex, onReposition])

  return (
    <div 
      ref={cloudRef}
      className="absolute"
      style={{ 
        left: `${position}%`, 
        top: `${cloudTop}%`,
        opacity: isVisible ? opacity : 0,
        zIndex,
        transition: 'opacity 0.3s ease-out, top 0.5s ease-out'
      }}
    >
      <Image 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className="select-none pointer-events-none"
      />
    </div>
  )
}

const ParallaxClouds = () => {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cloudPositions, setCloudPositions] = useState<Record<number, CloudPosition>>({})
  
  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  const checkOverlap = (newCloud: CloudPosition, id: number): boolean => {
    for (const cloudId in cloudPositions) {
      if (parseInt(cloudId) === id) continue
      
      const existingCloud = cloudPositions[parseInt(cloudId)]
      
      const overlapX = 
        newCloud.left < existingCloud.left + existingCloud.width && 
        newCloud.left + newCloud.width > existingCloud.left
      
      const overlapY = 
        newCloud.top < existingCloud.top + existingCloud.height && 
        newCloud.top + newCloud.height > existingCloud.top
      
      if (overlapX && overlapY) {
        return true
      }
    }
    
    return false
  }
  
  const handleReposition = (id: number, newPosition: CloudPosition) => {
    if (!checkOverlap(newPosition, id)) {
      setCloudPositions(prev => ({
        ...prev,
        [id]: newPosition
      }))
    } else {
      let attempts = 0;
      let adjustedPosition = { ...newPosition };
      
      while (attempts < 5 && checkOverlap(adjustedPosition, id)) {
        if ((id + attempts) % 2 === 0) {
          adjustedPosition.top = Math.max(5, adjustedPosition.top - (5 + attempts * 2));
        } else {
          adjustedPosition.top = Math.min(90, adjustedPosition.top + (5 + attempts * 2));
        }
        attempts++;
      }
      
      setCloudPositions(prev => ({
        ...prev,
        [id]: adjustedPosition
      }))
    }
  }
  
  const generateInitialPositions = useCallback(() => {
    const desktopClouds = [
      { 
        id: 1,
        src: '/images/cloud-small-75.png', 
        width: 120, 
        height: 60, 
        speed: 5, 
        initialLeft: 5,
        top: 5, 
        opacity: 0.75,
        zIndex: 1
      },
      { 
        id: 2,
        src: '/images/cloud-small-75.png', 
        width: 100, 
        height: 50, 
        speed: 7, 
        initialLeft: 30,
        top: 15, 
        opacity: 0.75,
        zIndex: 1
      },
      { 
        id: 3,
        src: '/images/cloud-small-50.png', 
        width: 150, 
        height: 75, 
        speed: 10, 
        initialLeft: 55,
        top: 35, 
        opacity: 0.5,
        zIndex: 2
      },
      { 
        id: 4,
        src: '/images/cloud-small-50.png', 
        width: 130, 
        height: 65, 
        speed: 12, 
        initialLeft: 80,
        top: 50, 
        opacity: 0.5,
        zIndex: 2
      },
      { 
        id: 5,
        src: '/images/cloud-big-50.png', 
        width: 200, 
        height: 100, 
        speed: 15, 
        initialLeft: 20,
        top: 70, 
        opacity: 0.5,
        zIndex: 3
      },
      { 
        id: 6,
        src: '/images/cloud-big-50.png', 
        width: 180, 
        height: 90, 
        speed: 18, 
        initialLeft: 70,
        top: 80, 
        opacity: 0.5,
        zIndex: 3
      }
    ];
    
    const mobileClouds = [
      { 
        id: 1,
        src: '/images/cloud-small-75.png', 
        width: 100, 
        height: 50, 
        speed: 5, 
        initialLeft: 10,
        top: 10, 
        opacity: 0.75,
        zIndex: 1
      },
      { 
        id: 3,
        src: '/images/cloud-small-50.png', 
        width: 120, 
        height: 60, 
        speed: 8, 
        initialLeft: 60,
        top: 40, 
        opacity: 0.5,
        zIndex: 2
      },
      { 
        id: 5,
        src: '/images/cloud-big-50.png', 
        width: 150, 
        height: 75, 
        speed: 12, 
        initialLeft: 30,
        top: 75, 
        opacity: 0.5,
        zIndex: 3
      },
      { 
        id: 4,
        src: '/images/cloud-big-50.png', 
        width: 150, 
        height: 75, 
        speed: 8, 
        initialLeft: 85,
        top: 90, 
        opacity: 0.5,
        zIndex: 3
      },
      { 
        id: 6,
        src: '/images/cloud-big-50.png', 
        width: 150, 
        height: 75, 
        speed: 18, 
        initialLeft: 90,
        top: 40, 
        opacity: 0.5,
        zIndex: 3
      },
      { 
        id: 2,
        src: '/images/cloud-small-50.png', 
        width: 150, 
        height: 75, 
        speed: 6, 
        initialLeft: 120,
        top: 25, 
        opacity: 0.5,
        zIndex: 3
      }
    ];
    
    const cloudConfigs = isMobile ? mobileClouds : desktopClouds;
    
    const initialPositions: Record<number, CloudPosition> = {};
    cloudConfigs.forEach(cloud => {
      initialPositions[cloud.id] = {
        left: cloud.initialLeft,
        top: cloud.top,
        width: cloud.width / 10,
        height: cloud.height / 10
      };
    });
    
    setCloudPositions(initialPositions);
    
    return cloudConfigs;
  }, [isMobile]);
  
  const cloudsRef = useRef<ReturnType<typeof generateInitialPositions> | null>(null);
  
  useEffect(() => {
    if (isClient) {
      cloudsRef.current = generateInitialPositions();
    }
  }, [isClient, isMobile, generateInitialPositions]);

  if (!isClient || !cloudsRef.current) {
    return <div className="fixed inset-0 overflow-hidden pointer-events-none"></div>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {cloudsRef.current.map((cloud) => (
        <Cloud 
          key={cloud.id}
          id={cloud.id}
          src={cloud.src}
          alt="Cloud"
          width={cloud.width}
          height={cloud.height}
          speed={cloud.speed}
          initialLeft={cloud.initialLeft}
          top={cloud.top}
          opacity={cloud.opacity}
          zIndex={cloud.zIndex}
          onReposition={handleReposition}
        />
      ))}
    </div>
  )
}

export default ParallaxClouds 