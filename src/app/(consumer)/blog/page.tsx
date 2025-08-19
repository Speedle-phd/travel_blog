import BlogActionBox from '@/components/BlogActionBox'
import Gallery from '@/components/Gallery'
import Underline from '@/components/Underline'
import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import Image from 'next/image'
import Link from 'next/link'
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
      return (
      <div className='tabs-box backdrop-filter backdrop-blur-sm bg-base-100/60 rounded-sm! p-4 flex flex-col items-center justify-center gap-4'>
         <div className='text-center'>No current trip found.</div>
         <button className="btn">
            <Link href='/upcoming' className='bg-base-100 hover:opacity-80 text-base-content'>
               Head to your upcoming trips
            </Link>
         </button>
      </div>
      )
   }

   const { destinationName, note, imageUrl, startingDate } = currentTrip
   const galleryImages = imageUrl?.slice(1) || []

   return (
      <div className='tabs-box backdrop-filter backdrop-blur-sm bg-base-100/60 rounded-sm! p-4'>
         
         <header className='flex gap-4'>
            <div className='avatar'>
               <div className='w-28 sm:w-48 mask mask-squircle'>
                  <Image
                     src={`https://static.speedle.dev/${imageUrl?.[0] || 'default-trip-image.jpg'}`}
                     alt={destinationName!}
                     width={400}
                     height={400}
                     className='object-cover object-cente mb-4'
                  />
               </div>
            </div>
            <div>
               <h2 className="sm:text-4xl">{destinationName}</h2>
               <p className="text-xs">{startingDate?.toLocaleDateString("de-DE", { month: 'long', year: 'numeric' })}</p>
               <p className='ml-4 font-indie my-6 text-lg'>
                  {note || 'No notes provided for this trip.'}
               </p>
            </div>
         </header>
         <BlogActionBox trip={currentTrip} />
         <Underline className="w-full my-8"/>
         <h3 className="text-5xl font-bold font-indie mb-4">Gallery</h3>
         <Gallery
            galleryImages={galleryImages}
            currentTrip={currentTrip}
            destinationName={destinationName!}
         />
      </div>
   )
}

export default Blog
