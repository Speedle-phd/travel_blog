import { db } from '@/drizzle/db'
import { DestinationTable, Priority } from '@/drizzle/schema'
import { eq, sql } from 'drizzle-orm'
import { unlink, writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import path from 'path'

export async function PUT(req: Request) {
   const formData = await req.formData()
   const id = formData.get('id')
   const destination = formData.get('destination') as string
   const note = formData.get('note') as string | null
   const imageUrl = formData.get('imageUrl') as File[] | null
   const priority = formData.get('priority') as Priority | null
   const oldImageUrl = formData.get('oldImageUrl') as string | null
   // Validate and process the data as needed
   console.log(imageUrl)
   try {
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
            const oldFileNamePath = process.cwd() + '/public/' + oldImageUrl!
            if (oldImageUrl && oldImageUrl !== 'default-trip-image.jpg') {
               await unlink(oldFileNamePath)
            }

         } catch (error) {
            console.error('Error saving image file:', error)
         }

      } // <-- Add this closing brace for the inner try block

      let response
      console.log(oldImageUrl, fileName)
      if (oldImageUrl) {
         response = await db
            .update(DestinationTable)
            .set({
               destinationName: destination,
               note,
               priority,
               imageUrl: sql`array_replace(${DestinationTable.imageUrl}, ${oldImageUrl}, ${fileName ? fileName : "default-trip-image.jpg"})`,
            })
            .where(eq(DestinationTable.id, id as string))
            .returning()
      } else {
         response = await db
            .update(DestinationTable)
            .set({
               destinationName: destination,
               note,
               priority,
               imageUrl: fileName ? [fileName] : null,
            })
            .where(eq(DestinationTable.id, id as string))
            .returning()
      }
      if (response.length === 0) {
         return new Response('Trip not found or no changes made', {
            status: 404,
         })
      }


      revalidatePath('/upcoming')
      revalidatePath('/blog')
      revalidatePath('/journal')
      return new Response('Trip updated successfully', { status: 200 })
   } catch (error) {
      console.error('Error processing form data:', error)
      return new Response('Error processing form data', { status: 500 })
   }
}
