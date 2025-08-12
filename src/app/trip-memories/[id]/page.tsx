import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Underline from '@/components/Underline'
import Gallery from '@/components/Gallery'
import FavButton from '@/components/FavButton'
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
   const { id } = await params
   let trip: typeof DestinationTable.$inferSelect | null = null
   try {
      // Fetch the trip details using the id
      trip =
         (await db.query.DestinationTable.findFirst({
            where: (fields, { eq }) => eq(fields.id, id),
         })) ?? null
      if (!trip) {
         throw new Error('Trip not found')
      }
   } catch (error) {
      console.error('Error fetching trip details:', error)
   }
   const { destinationName, imageUrl, startingDate, favorite } = trip ?? {}

   return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
         <Header />
         <Navigation />
         <div className='card bg-base-100 w-[clamp(17rem,70vw,40rem)] shadow-xl shadow-black overflow-hidden mx-auto relative my-10 p-4 flex flex-col gap-2'>
            <Link href='/journal' className='absolute top-4 right-4 z-10'>
               <div className='rounded-full bg-base-200 p-2 hover:bg-base-300 transition-colors'>
                  <ArrowLeft />
               </div>
            </Link>
            <header className='flex gap-2'>
               <div className='w-28 sm:w-48 mask mask-squircle'>
                  <Image
                     src={`/${imageUrl?.[0] || 'default-trip-image.jpg'}`}
                     alt={destinationName!}
                     width={400}
                     height={400}
                     className='object-cover object-center'
                  />
               </div>
               <div>
                  <h2 className='text-2xl font-bold mb-2 text-primary'>
                     {destinationName}
                  </h2>
                  <p>
                     {startingDate?.toLocaleDateString('de-DE', {
                        month: 'long',
                        year: 'numeric',
                     }) || 'No Date provided'}
                  </p>
               </div>
            </header>
            <FavButton id={id} isFavorite={favorite} />
            <Underline className='w-full mb-4' />
            <div>
               <h3 className='font-indie text-4xl mb-4'>Gallery</h3>
               <Gallery
                  galleryImages={imageUrl?.slice(1) ?? []}
                  currentTrip={trip!}
                  destinationName={destinationName!}
               />
            </div>
         </div>
      </div>
   )
}

export default page
