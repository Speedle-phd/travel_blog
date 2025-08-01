import AddTrip from '@/components/tabcontent/AddTrip'
import ViewTrips from '@/components/tabcontent/ViewTrips'
import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import React from 'react'

const page = async () => {
   // This is the main page for upcoming trips, which includes tabs for viewing and adding trips
   let trips : (typeof DestinationTable.$inferSelect)[] = []
   try {
      trips = await db.query.DestinationTable.findMany({
         where: (fields, { eq }) => eq(fields.upcomingTrip, true),
      })

   } catch (error) {
      console.error('Error in Upcoming Trips Page:', error)
   }

   return (
      <div className='tabs tabs-box backdrop-filter backdrop-blur-sm bg-opacity-50 opacity-90 rounded-sm!'>
         <input
            type='radio'
            name='my_tabs_6'
            className='tab rounded-[0.5rem_0.5rem_0_0]!'
            aria-label='View our upcoming trips'
            defaultChecked
         />
         <div className='tab-content bg-base-100 border-base-300 p-6'>
            <ViewTrips trips={trips} />
         </div>
         <input
            type='radio'
            name='my_tabs_6'
            className='tab rounded-[0.5rem_0.5rem_0_0]!'
            aria-label='Add a new trip'
         />
         <div className='tab-content bg-base-100 border-base-300 p-6'>
            <AddTrip />
         </div>
      </div>
   )
}

export default page
