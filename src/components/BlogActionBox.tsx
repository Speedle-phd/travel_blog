'use client'
import React from 'react'
import { z } from 'zod'
import { formSchema } from './tabcontent/AddTrip'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { DestinationTable } from '@/drizzle/schema'
import { useRouter } from 'next/navigation'

// If you want a schema with only the imageUrl field from formSchema:
const formImageSchema = formSchema.pick({ imageUrl: true })
type Props = {
   trip: typeof DestinationTable.$inferSelect | null
}
const BlogActionBox = ({ trip }: Props) => {
   const router = useRouter()
   const [modalOpen, setModalOpen] = React.useState(false)
   const [images, setImages] = React.useState<File[]>([])
   const form = useForm<z.infer<typeof formImageSchema>>({
      resolver: zodResolver(formImageSchema),
      defaultValues: {
         imageUrl: undefined,
      },
   })
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = form

   const onSubmit = async (data: z.infer<typeof formImageSchema>) => {
      const { imageUrl } = data
      if (!imageUrl || imageUrl.length === 0) return
      // Here you would typically send the image to your backend
      const formData = new FormData()
      console.log(imageUrl)
      for(const file of imageUrl) {
         formData.append('imageUrl', file)
      }
      formData.append('tripImages', JSON.stringify(trip?.imageUrl || []))
      formData.append('tripId', trip?.id || '')
      try {
         const response = await fetch('/api/v1/gallery', {
            method: 'PUT',
            body: formData,
         })
         if (!response.ok) {
            throw new Error('Failed to upload images')
         }
         // Optionally, you can update the trip state or refetch data here
         setModalOpen(false)
         setImages([])
         router.refresh()
      } catch (error) {
         console.error('Error uploading images:', error)
      }
   }
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
         setImages(Array.from(files))
      }
   }
   return (
      <>
         {modalOpen && (
            <div className='mt-20 absolute w-screen h-screen -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 bg-base-100/90 flex items-center justify-center z-[500]'>
               <div className='p-4 bg-base-100/100 rounded-lg shadow-xl border-2 w-[clamp(15rem,70vw,60rem)] '>
                  <h3 className='text-lg font-bold'>
                     Add photos to your gallery
                  </h3>
                  <div className='flex flex-col gap-4 my-4'>
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                           type='file'
                           accept='image/*'
                           multiple
                           className='file-input file-input-bordered w-full max-w-xs'
                           {...register('imageUrl', {
                              required: 'At least one image is required',
                              onChange: (e) => {
                                 handleFileChange(e)
                              },
                           })}
                        />
                        {errors.imageUrl?.message && (
                           <p className='text-red-500 text-sm'>
                              {typeof errors.imageUrl === 'object' &&
                              'message' in errors.imageUrl &&
                              errors.imageUrl.message
                                 ? String(errors.imageUrl.message)
                                 : null}
                           </p>
                        )}
                        <div className='preview my-4 max-h-[30vh] overflow-y-auto'>
                           {images.length > 0 && (
                              <div className='auto-grid'>
                                 {images.map((image, index) => (
                                    <div
                                       key={index}
                                       className='w-full aspect-square relative'
                                    >
                                       <Image
                                          data-image={image.name}
                                          src={URL.createObjectURL(image)}
                                          alt={`Preview ${index + 1}`}
                                          className='object-cover object-center rounded-lg'
                                          fill
                                       />
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                        <div className='flex justify-end'>
                           <button
                              className='btn'
                              type='submit'
                              disabled={isSubmitting || images.length === 0}
                           >
                              {isSubmitting ? (
                                 <span className='loading loading-spinner'></span>
                              ) : (
                                 'Save'
                              )}
                           </button>
                           <button
                              className='btn'
                              onClick={() => {
                                 setModalOpen(false)
                                 setImages([])
                              }}
                              disabled={isSubmitting}
                           >
                              {isSubmitting ? (
                                 <span className='loading loading-spinner'></span>
                              ) : (
                                 'Cancel'
                              )}
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         )}
         <div className='flex gap-2 items-center my-4'>
            <button className='btn' onClick={() => setModalOpen(true)}>
               Add photos
            </button>
            <button className='btn'>Edit</button>
            <button className='btn'>End Trip</button>
         </div>
      </>
   )
}

export default BlogActionBox
