import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import { writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import path from 'path'
import { eq } from 'drizzle-orm'
export async function POST(request: Request) {
   try {
      const body = await request.formData()
      // Process the body as needed
      const { destination, note, imageUrl, priority } = Object.fromEntries(
         body.entries()
      )
      let fileName = null
      // Example: Save the image file if it exists
      if (imageUrl && imageUrl instanceof File) {
         const buffer = await imageUrl.arrayBuffer()
         // Save the buffer to a file or database
         try {
            fileName = Date.now() + '-' + imageUrl.name
            const destinationPath = process.cwd() + '/public/'
            await writeFile(
               path.join(destinationPath, fileName),
               Buffer.from(buffer)
            )
         } catch (error) {
            console.error('Error saving image file:', error)
         }
      }
      const databaseEntry = {
         destinationName: destination,
         note,
         imageUrl: fileName ? [fileName] : null,
         priority: priority || 'LOW',
      } as {
         destinationName: string
         note?: string
         imageUrl?: string[] | null
         priority: 'LOW' | 'MEDIUM' | 'HIGH'
      }

      const response = await db
         .insert(DestinationTable)
         .values(databaseEntry)
         .returning()

      if (response.length === 0) {
         return new Response(JSON.stringify({ error: 'Failed to add trip' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         })
      }
      revalidatePath('/upcoming') // Revalidate the upcoming trips page
      // Here you would typically save the data to a database or perform some action
      return new Response(
         JSON.stringify({ message: 'Trip added successfully' }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )

      // No return here; response is handled in reader.onload
   } catch (error) {
      console.error('Error processing request:', error)
      return new Response(JSON.stringify({ error: 'Failed to add trip' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      })
   }
}

export async function DELETE(request: Request) {
   try {
      const body = await request.json()
      const { id } = body
      if (!id) {
         return new Response(JSON.stringify({ error: 'Trip ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         })
      }
      // Place this import at the top of your file if not already present
      const deletedTrip = await db
         .delete(DestinationTable)
         .where(eq(DestinationTable.id, id))
         .returning()
      if (deletedTrip.length === 0) {
         return new Response(JSON.stringify({ error: 'Trip not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         })
      }
      revalidatePath('/upcoming') // Revalidate the upcoming trips page
      return new Response(
         JSON.stringify({ message: 'Trip deleted successfully' }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error('Error deleting trip:', error)
      return new Response(JSON.stringify({ error: 'Failed to delete trip' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      })
   }
}

export async function PUT(request: Request) {
   try {
      const body = await request.json()
      const { id } = body
      if (!id) {
         return new Response(JSON.stringify({ error: 'Trip ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         })
      }

      const currentTrip = await db.query.DestinationTable.findFirst({
         where: (fields, { eq }) => eq(fields.currentTrip, true),
      })


      let updateData = {}
      if (body.destinationName) {
         updateData = {...updateData, destinationName: body.destinationName }
      }
      if (body.note) {
         updateData = {...updateData, note: body.note }
      }
      if (body.imageUrl) {
         updateData = {...updateData, imageUrl: body.imageUrl }
      }
      if (body.priority) {
         updateData = {...updateData, priority: body.priority }
      }
      if (body.currentTrip !== undefined) {

         if (currentTrip?.currentTrip && body.currentTrip) {
            return new Response(
               JSON.stringify({ error: 'You already have a current trip. Please finish it before starting a new one.' }),
               {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
               }
            )
         } else {
            updateData = { ...updateData, currentTrip: body.currentTrip }
         }
      }
      if (body.upcomingTrip !== undefined) {
         updateData = {...updateData, upcomingTrip: body.upcomingTrip }
      }
      if (body.finishedTrip !== undefined) {
         
         updateData = {...updateData, finishedTrip: body.finishedTrip }
      }

      if (Object.keys(updateData).length === 0) {
         return new Response(JSON.stringify({ error: 'No fields to update' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         })
      }

      const updatedTrip = await db
         .update(DestinationTable)
         .set(updateData)
         .where(eq(DestinationTable.id, id))
         .returning()

      if (updatedTrip.length === 0) {
         return new Response(JSON.stringify({ error: 'Trip not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         })
      }
      revalidatePath('/upcoming')
      revalidatePath("/blog")
      revalidatePath("/journal") // Revalidate the upcoming trips page
      return new Response(
         JSON.stringify({ message: 'Trip updated successfully' }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error('Error updating trip:', error)
      return new Response(JSON.stringify({ error: 'Failed to update trip' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      })
   }
}