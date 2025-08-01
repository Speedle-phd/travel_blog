'use client'
import { DestinationTable } from '@/drizzle/schema'
import React from 'react'
import TripTile from '../TripTile'
import useResize from '@/hooks/useResize'

type Props = { trips: (typeof DestinationTable.$inferSelect)[] }

const ViewTrips = ({ trips }: Props) => {
   const width = useResize()

   if (width > 640) {
      return (
         <div>
            {trips.length > 0 ? (
               <>
                  {trips.map((trip) => (
                     <TripTile key={trip.id} trip={trip} />
                  ))}
               </>
            ) : (
               <p>No upcoming trips found.</p>
            )}
         </div>
      )
   }

   return (
      <>
         {trips.length > 0 ? (
            <>
               <div className='carousel w-full'>
                  {trips.map((trip, index) => {
                     const lastIndex = trips.length - 1
                     const nextIndex = index === lastIndex ? 0 : index + 1
                     const prevIndex = index === 0 ? lastIndex : index - 1
                     return (
                        <div
                           key={trip.id}
                           id={`slide${index}`}
                           className='relative carousel-item w-full'
                        >
                           <TripTile trip={trip} className='w-full' />
                           <div className='absolute left-5 right-5 top-[40%] flex transform justify-between'>
                              <a href={`#slide${prevIndex}`} className='btn btn-circle btn-sm'>
                                 ❮
                              </a>
                              <a href={`#slide${nextIndex}`} className='btn btn-circle btn-sm'>
                                 ❯
                              </a>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </>
         ) : (
            <p>No upcoming trips found.</p>
         )}
      </>
   )
}

export default ViewTrips
