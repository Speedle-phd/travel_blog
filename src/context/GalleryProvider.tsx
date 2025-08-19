"use client";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GalleryContextType = {
   isOpen: boolean;
   images: string[];
   openGallery: (images: string[]) => void;
   closeGallery: () => void;
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
   const context = useContext(GalleryContext);
   if (!context) {
      throw new Error('useGallery must be used within a GalleryProvider');
   }
   return context;
};

type GalleryProviderProps = {
   children: ReactNode;
};

export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [images, setImages] = useState<string[]>([]);
   

   const openGallery = (imgs: string[]) => {
      setImages(imgs);
      setIsOpen(true);
   };

   const closeGallery = () => {
      setIsOpen(false);
      setImages([]);
   };

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
                           src={`https://static.speedle.dev/${img}`}
                           alt={`Gallery ${idx}`}
                           width={1600}
                           height={1000}
                           className={cn(
                              `object-cover object-center rounded-lg mx-auto`
                           )}
                        />
                     </div>
                  ))}
               </div>
               <div className='flex w-full justify-center gap-2 py-2'>
                  {images.map((_, idx) => (
                     <a
                        key={idx}
                        href={`#item${idx}`}
                        className='btn btn-xs rounded-sm! bg-base-100 hover:bg-base-300 font-indie text-lg'
                     >
                        {idx + 1}
                     </a>
                  ))}
               </div>
            </div>
         )}
      </GalleryContext.Provider>
   )
};