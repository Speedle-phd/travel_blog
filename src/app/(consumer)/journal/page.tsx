import Underline from '@/components/Underline'
import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import JourneyGallery from '@/components/JourneyGallery'
import FilterFavButton from '@/components/FilterFavButton'
const page = async () => {
   let completedTrips: (typeof DestinationTable.$inferSelect)[] = []
   try {
      // Fetch completed trips
      completedTrips =
         (await db.query.DestinationTable.findMany({
            where: (fields, { eq }) => eq(fields.finishedTrip, true),
         })) ?? []

      console.log(completedTrips)
   } catch (error) {
      console.error('Error fetching completed trips:', error)
   }

   if (completedTrips.length === 0) {
      return (
         <div className='tabs-box backdrop-filter backdrop-blur-sm bg-base-100/60 rounded-sm! p-4 flex flex-col items-center justify-center gap-4'>
            <div className='text-center'>No completed trips found.</div>
            <button className='btn'>
               <Link
                  href='/upcoming'
                  className='bg-base-100 hover:opacity-80 text-base-content'
               >
                  Head to your upcoming trips
               </Link>
            </button>
         </div>
      )
   }

   return (
      <div className='tabs-box backdrop-filter backdrop-blur-sm bg-base-100/60 rounded-sm! p-4'>
         <div className="flex justify-between items-center">
            <header className="flex items-center gap-2">
               <h2 className='text-2xl font-bold'>See our journeys </h2>
               <Heart />
            </header>
            <FilterFavButton />
         </div>
            <Underline className='w-full my-4' />
            <JourneyGallery completedTrips={completedTrips} />
      </div>
   )
}

export default page
