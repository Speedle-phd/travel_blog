
import React from 'react'
import GalleryElement from './GalleryElement'
import { DestinationTable } from '@/drizzle/schema'

type Props = {
   galleryImages: string[]
   currentTrip: typeof DestinationTable.$inferSelect
   destinationName: string
}
const Gallery = ({ galleryImages, currentTrip, destinationName }: Props) => {
   
   return (
      <div className='gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
         {galleryImages.length > 0 ? (
            galleryImages.map((image, index) => (
               <GalleryElement
                  id={currentTrip.id}
                  key={index}
                  image={image}
                  destinationName={destinationName!}
                  index={index}
                  images={currentTrip.imageUrl ?? []}
               />
            ))
         ) : (
            <p>No gallery images available.</p>
         )}
      </div>
   )
}

export default Gallery
