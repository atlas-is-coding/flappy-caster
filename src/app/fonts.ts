import localFont from 'next/font/local'
import React from 'react'

export const jetbrainsMono = localFont({
  src: [
    {
      path: '../../public/fonts/JetBrainsMono-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const jersey = localFont({
  src: [
    {
      path: '../../public/fonts/Jersey10-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-jersey',
  display: 'swap',
})

export const fonts = {
  jetbrainsMono,
  jersey,
}

export type FontFamily = keyof typeof fonts
export type FontVariables = string

export const getFontVariable = (fontFamily: FontFamily): string => {
  return fonts[fontFamily].variable
}

export const getFontClass = (fontFamily: FontFamily): string => {
  return fonts[fontFamily].className
}

export const getFontStyle = (fontFamily: FontFamily): React.CSSProperties => {
  return {
    fontFamily: `var(${fonts[fontFamily].variable})`,
  }
}

export const fontVariables = Object.values(fonts).map(font => font.variable).join(' ') 