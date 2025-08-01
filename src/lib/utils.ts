import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function getBackgroundImage(srcSet = '') {
   const imageSet = srcSet
      .split(', ')
      .map((str) => {
         const [url, dpi] = str.split(' ')
         return `url("${url}") ${dpi}`
      })
      .join(', ')
   return `image-set(${imageSet})`
}