'use client'
import { DestinationTable } from '@/drizzle/schema'
// import { imageLoader } from '@/lib/imageLoader'

import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
   trip: typeof DestinationTable.$inferSelect
   className?: string
}



const TripTile = ({ trip, className }: Props) => {
   const image = trip.imageUrl?.[0] ?? 'default-trip-image.jpg' // Fallback image if none provided
   return (
      <div className={`card sm:card-side shadow-lg opacity-100 bg-base-100 hover:bg-base-200 transition-all duration-300 ease-in-out p-4 mb-4 ${className}`}>
         <div className='aspect-square relative sm:w-36'>
            <Image
               // loader={imageLoader}
               src={`https://static.speedle.dev/${image || 'default-trip-image.jpg'}`}
               alt={trip.destinationName}
               fill
               className='object-cover object-center rounded'
               sizes='(max-width: 640px) 100vw, (min-width: 641px) 200px'
               priority
               unoptimized={true} // Use this if you have issues with image optimization in Docker
            />

         </div>
         <div className='ml-2 flex gap-4 sm:gap-0 flex-col sm:flex-row justify-between w-full'>
            <div className='flex flex-col justify-between'>
               <header>
                  <div className="text-[0.7rem]">
                     Name of our Destination:
                  </div>
                  <h3 className='trip-title ml-4 text-2xl font-bold '>{trip.destinationName}</h3>
               </header>
               <p className='text-[0.6rem] text-gray-500'>
                  Created At: {new Date(trip.createdAt).toLocaleDateString()}
               </p>
            </div>
            <div>
               <h4 className="text-[0.7rem]">Some notes for our Trip:</h4>
               <p className='ml-4 font-indie mt-2'>{trip.note}</p>
            </div>
            <div className={`badge ${trip.priority === 'HIGH' ? 'badge-error' : trip.priority === 'MEDIUM' ? 'badge-warning' : 'badge-success'}`}>{trip.priority}</div>
         </div>
         <aside className="absolute bottom-2 right-2"><Link href={`/trips/${trip.id}`}>
            <button className="btn btn-sm btn-ghost" aria-label="Edit trip details">
               <Edit />
            </button>
         </Link></aside>
      </div>
   )
}

export default TripTile
