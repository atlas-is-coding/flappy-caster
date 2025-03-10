'use client'

import { useMemo } from 'react'
import { FontFamily, getFontStyle, getFontClass } from '../fonts'
import React from 'react'

export const useFont = (font: FontFamily) => {
  const fontData = useMemo(() => {
    return {
      style: getFontStyle(font),
      
      className: getFontClass(font),
      
      combineStyle: (additionalStyle: React.CSSProperties = {}) => {
        return { ...getFontStyle(font), ...additionalStyle }
      },
      
      combineClass: (additionalClass: string = '') => {
        return `${getFontClass(font)} ${additionalClass}`
      }
    }
  }, [font])

  return fontData
}

export default useFont 