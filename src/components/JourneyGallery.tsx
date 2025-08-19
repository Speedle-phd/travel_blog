"use client"
import { DestinationTable } from '@/drizzle/schema'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
type Props = {
   completedTrips: (typeof DestinationTable.$inferSelect)[]
}
const JourneyGallery = ({ completedTrips }: Props) => {
   const searchQueries = useSearchParams()
   const filterForFavorites = searchQueries.get('favorites') ?? false
   const filterFunction = (trip: typeof DestinationTable.$inferSelect) => {
      if (filterForFavorites === 'true') {
         return trip.favorite
      }
      return true
   }
   return (
      <div className='auto-grid'>
         {completedTrips.filter(filterFunction).length === 0 && (
            <div className='text-center text-lg font-semibold'>
               No completed trips found.
            </div>
         )}
         {completedTrips.filter(filterFunction).map((trip) => (
            <Link
               href={`/trip-memories/${trip.id}`}
               key={trip.id}
               className='relative shadow-sm p-4 shadow-base-100 overflow-hidden w-[clamp(15rem,40vw,30rem)]'
            >
               <h3 className='text-center text-4xl font-semibold font-indie'>
                  {trip.destinationName}
               </h3>
               <p className='text-center text-xs mb-4'>
                  {trip.startingDate?.toLocaleDateString('de-DE', {
                     month: 'long',
                     year: 'numeric',
                  }) ?? 'No Date provided'}
               </p>
               <Image
                  src={`https://static.speedle.dev/${trip.imageUrl?.[0] || 'default-trip-image.jpg'}`}
                  alt={trip.destinationName!}
                  width={400}
                  height={400}
                  className='object-cover object-center mx-auto'
               />
               {trip.favorite && <Heart className='absolute top-4 right-4' />}
            </Link>
         ))}
      </div>
   )
}

export default JourneyGallery
