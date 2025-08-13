import { db } from '@/drizzle/db'
import { DestinationTable } from '@/drizzle/schema'
import { eq, sql } from 'drizzle-orm'
import { unlink, writeFile } from 'fs/promises'
export async function PUT(request: Request) {
   const body = await request.formData()
   console.log(body)
   const imageUrlsRaw = body.getAll('imageUrl') as File[]
   const imageUrls = imageUrlsRaw ? Array.from(imageUrlsRaw) : null
   const tripImages = JSON.parse(body.get('tripImages') as string) || []
   // Process the imageUrls as needed
   if (!imageUrls) return new Response(
      JSON.stringify({ error: 'No images provided' }),
      {
         status: 400,
         headers: { 'Content-Type': 'application/json' },
      }
   )
   imageUrls.forEach((file) => {
      console.log('File to upload:', file.name)
   })
   try {
      // Here you would typically save the images to your database or storage
      // For demonstration, we will just log them
      const buffers = await Promise.all(
         imageUrls
            .filter((entry): entry is File => entry instanceof File)
            .map(async (file) => {
               return await file.arrayBuffer()
            })
      )
      imageUrls.forEach((url, index) => {
         console.log(JSON.stringify(url.name), index)
      })
      const destinationPath = process.cwd() + '/public/'
      const fileNames = imageUrls
         .filter((entry): entry is File => entry instanceof File)
         .map((file) => Date.now() + '-' + file.name)
      await Promise.all(
         buffers.map(async(buffer, index) => {
            const filePath = destinationPath + fileNames[index]
            return await writeFile(filePath, Buffer.from(buffer))
         })
      )
      console.log('Files saved:', fileNames)
      const dbEntry = [...(tripImages || []), ...fileNames]
      console.log('Database entry:', dbEntry)

      const response = await db.update(DestinationTable).set({ imageUrl: dbEntry }).where(
         eq(DestinationTable.id, body.get('tripId') as string)
      ).returning()
      if (response.length === 0) {
         return new Response(
            JSON.stringify({ error: 'Failed to update trip images' }),
            {
               status: 500,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      return new Response(
         JSON.stringify({ message: 'Images uploaded successfully' }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error('Error uploading images:', error)
      return new Response(
         JSON.stringify({ error: 'Failed to upload images' }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   }
}

export async function DELETE(request: Request) {
   const body = await request.json()
   const { tripId, imageName } = body
   if (!imageName) {
      return new Response(
         JSON.stringify({ error: 'Image name is required' }),
         {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   }
   try {
      // Logic to delete the image from the database and filesystem
      // First, fetch the current imageUrl array
      // const current = await db.select().from(DestinationTable).where(
      //    eq(DestinationTable.id, tripId)
      // )
      // const currentImages = current[0]?.imageUrl || []
      // const updatedImages = currentImages.filter((img: string) => img !== imageName)
      // const response = await db.update(DestinationTable).set({
      //    imageUrl: updatedImages
      // }).where(
      //    eq(DestinationTable.id, tripId)
      // ).returning()

      const response = await db
         .update(DestinationTable)
         .set({
            imageUrl: sql`array_remove(${DestinationTable.imageUrl}, ${imageName})`,
         })
         .where(eq(DestinationTable.id, tripId))
         .returning()

      if (response.length === 0) {
         return new Response(
            JSON.stringify({ error: 'Failed to delete image' }),
            {
               status: 500,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      // Optionally, delete the file from the filesystem
      const filePath = process.cwd() + '/public/' + imageName
      if (filePath && imageName !== 'default-trip-image.jpg') {
         await unlink(filePath)
      }

      console.log(`File deleted: ${filePath}`)

      return new Response(
         JSON.stringify({ message: 'Image deleted successfully' }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error('Error deleting image:', error)
      return new Response(
         JSON.stringify({ error: 'Failed to delete image' }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   }
}