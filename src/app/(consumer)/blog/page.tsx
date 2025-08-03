
import BlogActionBox from '@/components/BlogActionBox'
import Underline from '@/components/Underline'
import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import Image from 'next/image'
import React from 'react'

const Blog = async() => {
   let currentTrip : typeof DestinationTable.$inferSelect | null = null
   try {
      // Fetch the current trip details
      currentTrip = (await db.query.DestinationTable.findFirst({ where: (fields, { eq }) => eq(fields.currentTrip, true) })) ?? null
   } catch (error) {
      console.error('Error in Blog Page:', error)
      
   }


   if (!currentTrip) {
      return <div className='text-center'>No current trip found.</div>
   }

   const { destinationName, note, imageUrl, priority } = currentTrip
   const galleryImages = imageUrl?.slice(1) || []

   return (
      <div className='tabs-box backdrop-filter backdrop-blur-sm bg-base-100/60 rounded-sm! p-4'>
         <header className='flex gap-4'>
            <div className='avatar'>
               <div className='w-28 sm:w-48 mask mask-squircle'>
                  <Image
                     src={`/${imageUrl?.[0] || 'default-trip-image.jpg'}`}
                     alt={destinationName!}
                     width={400}
                     height={400}
                     className='object-cover object-cente mb-4'
                  />
               </div>
            </div>
            <div>
               <h2 className="sm:text-4xl">{destinationName}</h2>
               <p className='ml-4 font-indie my-6 text-lg'>
                  {note || 'No notes provided for this trip.'}
               </p>
            </div>
         </header>
         <BlogActionBox trip={currentTrip} />
         <Underline className="w-full my-8"/>
         <h3 className="text-5xl font-bold font-indie mb-4">Gallery</h3>
         <div className='gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {galleryImages.length > 0 ? (
               galleryImages.map((image, index) => (
                  <div key={index} className='w-full h-48 relative'>
                     <Image
                        src={`/${image}`}
                        alt={`${destinationName} Gallery Image ${index + 1}`}
                        fill
                        className='object-cover object-center rounded-lg'
                     />
                  </div>
               ))
            ) : (
               <p>No gallery images available.</p>
            )}
         </div>
      </div>
   )
}

export default Blog
