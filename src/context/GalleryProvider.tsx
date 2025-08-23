'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type GalleryContextType = {
   isOpen: boolean
   images: string[]
   openGallery: (images: string[], currentIndex: number) => void
   closeGallery: () => void

}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export const useGallery = () => {

   const context = useContext(GalleryContext)
   if (!context) {
      throw new Error('useGallery must be used within a GalleryProvider')
   }
   return context
}

type GalleryProviderProps = {
   children: ReactNode
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({
   children,
}) => {
   // get # part from url
   const path = usePathname()
   console.log(path)
   const [isOpen, setIsOpen] = useState(false)
   const [images, setImages] = useState<string[]>([])
   const [index, setIndex] = useState(0)

   const openGallery = (imgs: string[], currentIndex: number) => {
      setIndex(currentIndex)
      setImages(imgs)
      setIsOpen(true)
   }

   const closeGallery = () => {
      setIsOpen(false)
      setImages([])
      setIndex(0)
   }
   const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target
      console.log(target)
      const newIdx = e.currentTarget?.innerHTML ? parseInt(e.currentTarget?.innerHTML) - 1 : 0
      setIndex(newIdx)
   }

   return (
      <GalleryContext.Provider
         value={{ isOpen, images, openGallery, closeGallery }}
      >
         {children}
         {isOpen && (
            <div className='fixed inset-0 bg-black flex flex-col items-center justify-center z-50'>
               <button
                  className='btn fixed top-2 left-2'
                  onClick={closeGallery}
               >
                  Close
               </button>
               <div className='carousel w-[clamp(20rem,80vw,80rem)]'>
                  {images.map((img, idx) => (
                     <div
                        key={idx}
                        id={`item${idx}`}
                        className='carousel-item w-full'
                     >
                        <Image
                           src={`${process.env.NEXT_PUBLIC_STATIC}${img}`}
                           alt={`Gallery ${idx}`}
                           width={1600}
                           height={1600}
                           className={cn(
                              `object-contain max-h-[calc(100dvh-10rem)] rounded-lg mx-auto`
                           )}
                        />
                     </div>
                  ))}
               </div>
               <div className='flex flex-wrap w-full justify-center gap-2 py-2'>
                  {images.map((_, idx) => {
                     console.log(idx, index)
                     return (
                     <a
                        
                        key={idx}
                        href={`#item${idx}`}
                        className={cn('btn btn-xs rounded-sm! bg-base-100 hover:bg-base-300 font-indie text-lg px-0 w-[1.5rem]', { 'bg-accent text-black': idx === index })}
                     >
                        <button className="w-full h-full" onClick={handleChange}>{idx + 1}</button>
                     </a>
                  )})}
               </div>
            </div>
         )}
      </GalleryContext.Provider>
   )
}
