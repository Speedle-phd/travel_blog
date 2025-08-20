'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { fileWhiteList, formSchema } from './tabcontent/AddTrip'
import { z } from 'zod'
import { DestinationTable } from '@/drizzle/schema'
import { getCookie } from 'cookies-next'
type Props = {
   id: string
   trip: typeof DestinationTable.$inferSelect | null
}

const TripActionBox = ({ id, trip }: Props) => {
   const authRole = getCookie('authRole')
   const [loading, setLoading] = React.useState(false)
   const [customError, setCustomError] = React.useState<string | null>(null)
   const [showEditModal, setShowEditModal] = React.useState(false)
   const router = useRouter()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         destination: trip?.destinationName || '',
         note: trip?.note || '',
         imageUrl: undefined,
         priority: trip?.priority || 'LOW',
      },
   })

   const {
      register,
      handleSubmit,
      setError,

      formState: { errors, isSubmitting },
   } = form
   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      const { destination, note, imageUrl, priority } = data
      const { type } = imageUrl[0] || {}
      console.log(imageUrl)
      if (imageUrl && imageUrl.length > 0 && !fileWhiteList.includes(type)) {
         setError('imageUrl', {
            type: 'manual',
            message: `Only ${fileWhiteList.join(', ')} files are allowed.`,
         })
         return
      }
      // Here you would typically send the data to your backend
      const formData = new FormData()
      formData.append('id', id)
      formData.append('destination', destination)
      formData.append('oldImageUrl', trip?.imageUrl?.[0] || '')
      if (note) formData.append('note', note)
      if (priority) formData.append('priority', priority)
      if (imageUrl && imageUrl.length > 0)
         formData.append('imageUrl', imageUrl[0])

      try {
         const response = await fetch('/api/v1/trip/edit', {
            method: 'PUT',
            body: formData,
            
         })
         if (!response.ok) {
            const errorData = await response.json()
            setError('root', {
               type: 'manual',
               message: errorData.error || 'Failed to add trip',
            })
            return
         }
         form.reset()
         router.refresh()
         setShowEditModal(false)
      } catch (error) {
         console.error('Error submitting form:', error)
         setError('root', {
            type: 'manual',
            message: 'Failed to add trip',
         })
      }
   }

   const handleVisit = async () => {
      if (authRole === "guest") return
      setLoading(true)
      try {
         const response = await fetch(`/api/v1/trip`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               id,
               currentTrip: true,
               upcomingTrip: false,
               finishedTrip: false,
               startingDate: new Date().toISOString(),
            }),
         })
         if (!response.ok) {
            const errorData = await response.json()
            setCustomError(errorData.error || 'Failed to visit trip')
            throw new Error('Failed to edit trip')
         }
         router.push('/blog')
      } catch (error) {
         console.error('Error editing trip:', error)
      } finally {
         setLoading(false)
      }
   }
   const handleDelete = async () => {
      if (authRole === "guest") return
      setLoading(true)

      try {
         const response = await fetch('/api/v1/trip', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
         })
         if (!response.ok) {
            throw new Error('Failed to delete trip')
         }
         router.push('/upcoming')
      } catch (error) {
         console.error('Error deleting trip:', error)
      } finally {
         setLoading(false)
      }
   }
   const handleEdit = () => {
      if (authRole === "guest") return
      setShowEditModal(true)
      // Logic to open the edit modal
      // This could be a state change that triggers a modal component to render
      // For now, we just log the action
      console.log('Edit trip with id:', id)
   }
   const closeModal = () => {
      setShowEditModal(false)
   }

   useEffect(() => {
      const timeout: NodeJS.Timeout = setTimeout(() => {
         setCustomError(null)
      }, 3000)
      return () => clearTimeout(timeout)
   }, [customError])

   return (
      <div className='card-actions justify-end mt-4'>
         {customError && (
            <aside className='bg-base-100 p-4 rounded-lg border-2 border-red-700 fixed z-50 top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 text-sm'>
               {customError}
            </aside>
         )}
         <button
            disabled={loading}
            className='btn rounded btn-warning'
            onClick={handleEdit}
         >
            {loading ? (
               <span className='loading loading-spinner'></span>
            ) : (
               'Edit'
            )}
         </button>
         <button
            disabled={loading}
            className='btn rounded btn-error'
            onClick={handleDelete}
         >
            {loading ? (
               <span className='loading loading-spinner'></span>
            ) : (
               'Delete'
            )}
         </button>
         <button
            disabled={loading}
            className='btn rounded btn-primary'
            onClick={handleVisit}
         >
            {loading ? (
               <span className='loading loading-spinner'></span>
            ) : (
               'Visit'
            )}
         </button>

         {showEditModal && (
            <aside className='absolute backdrop-filter backdrop-blur-sm shadow-lg z-[10000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
               <div className='rounded-lg w-[20rem] bg-base-100/90 p-4 shadow-lg'>
                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className='flex flex-col'
                  >
                     <fieldset className='fieldset'>
                        <legend className='fieldset-legend'>
                           Name of the Destination
                        </legend>
                        <input
                           type='text'
                           className='input'
                           placeholder='Destination...'
                           {...register('destination')}
                        />
                        {errors.destination && (
                           <span className='text-red-500 text-sm'>
                              {errors.destination.message}
                           </span>
                        )}
                     </fieldset>
                     <fieldset className='fieldset'>
                        <legend className='fieldset-legend'>
                           Notes for your destination
                        </legend>
                        <textarea
                           className='textarea h-24'
                           placeholder='Notes...'
                           {...register('note')}
                        ></textarea>
                        <div className='label'>Optional</div>
                        {errors.note && (
                           <span className='text-red-500 text-sm'>
                              {errors.note.message}
                           </span>
                        )}
                     </fieldset>
                     <fieldset className='fieldset'>
                        <legend className='fieldset-legend'>
                           Pick an image
                        </legend>
                        <input
                           type='file'
                           className='file-input'
                           {...register('imageUrl')}
                        />
                        <label className='label'>Optional</label>
                        {errors.imageUrl && (
                           <span className='text-red-500 text-sm'>
                              {typeof errors.imageUrl === 'object' &&
                              'message' in errors.imageUrl &&
                              errors.imageUrl.message
                                 ? String(errors.imageUrl.message)
                                 : null}
                           </span>
                        )}
                     </fieldset>
                     <fieldset className='fieldset'>
                        <legend className='fieldset-legend'>Priority</legend>
                        <select
                           defaultValue='Pick a browser'
                           className='select'
                           {...register('priority')}
                        >
                           <option disabled={true}>Set a priority</option>
                           <option>LOW</option>
                           <option>MEDIUM</option>
                           <option>HIGH</option>
                        </select>
                        <span className='label'>Defaults to LOW</span>
                        {errors.priority && (
                           <span className='text-red-500 text-sm'>
                              {errors.priority.message}
                           </span>
                        )}
                     </fieldset>
                     <div className='flex gap-2 justify-end'>
                        <button
                           disabled={isSubmitting}
                           className='btn'
                           type='submit'
                        >
                           {isSubmitting ? (
                              <span className='loading loading-ring loading-lg'></span>
                           ) : (
                              'Edit Trip'
                           )}
                        </button>
                        <button className='btn' onClick={closeModal}>
                           {isSubmitting ? (
                              <span className='loading loading-ring loading-lg'></span>
                           ) : (
                              'Cancel'
                           )}
                        </button>
                     </div>
                  </form>
               </div>
            </aside>
         )}
      </div>
   )
}

export default TripActionBox
