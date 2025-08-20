import React from 'react'

interface Props {
   amount: number
}

const GalleryLoader = ({ amount }: Props) => {
   return (
      <div className='gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
         {Array.from({ length: amount }, (_, index) => (
            <div key={index} className='animate-pulse'>
               <div className='h-48 bg-base-100 shadow-lg rounded-xl'></div>
            </div>
         ))}
      </div>
   )
}

export default GalleryLoader
