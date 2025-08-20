import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import TripActionBox from '@/components/TripActionBox'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'

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
   const { destinationName, note, imageUrl, priority } = trip ?? {}

   return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
         <Header />
         <Navigation />
         <div className='card bg-base-100 w-[clamp(17rem,70vw,40rem)] shadow-xl shadow-black  mx-auto relative'>
            <Link href='/upcoming' className='absolute top-4 right-4 z-10'>
               <div className='rounded-full bg-base-200 p-2 hover:bg-base-300 transition-colors'>
                  <ArrowLeft />
               </div>
            </Link>
            <Image
               src={
                  imageUrl?.[0]
                     ? `${process.env.NEXT_PUBLIC_STATIC}${imageUrl[0]}`
                     : `${process.env.NEXT_PUBLIC_STATIC}default-trip-image.jpg`
               }
               alt={destinationName!}
               width={400}
               height={400}
               className='object-cover object-center w-full rounded-t-2xl max-h-100'
            />
            <div className='card-body'>
               <h2 className='card-title'>{destinationName!}</h2>
               <p className='font-indie'>
                  {note || 'No notes provided for this trip.'}
               </p>
               <div
                  className={`badge ${
                     priority === 'HIGH'
                        ? 'badge-error'
                        : priority === 'MEDIUM'
                        ? 'badge-warning'
                        : 'badge-success'
                  }`}
               >
                  {priority}
               </div>
               <TripActionBox id={id} trip={trip} />
            </div>
         </div>
      </div>
   )
}

export default page
