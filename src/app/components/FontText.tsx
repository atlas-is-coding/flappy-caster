'use client'

import React, { ElementType } from 'react'
import { FontFamily, getFontClass, getFontStyle } from '../fonts'

type FontTextProps<T extends ElementType = 'span'> = {
  font: FontFamily
  children: React.ReactNode
  className?: string
  useClass?: boolean
  as?: T
  style?: React.CSSProperties
} & React.ComponentPropsWithoutRef<T>

const FontText = <T extends ElementType = 'span'>({
  font,
  children,
  className = '',
  useClass = false,
  as,
  style,
  ...props
}: FontTextProps<T>) => {
  const Component = as || 'span'

  if (useClass) {
    return (
      <Component
        className={`${getFontClass(font)} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={className}
      style={{ ...getFontStyle(font), ...style }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default FontText 