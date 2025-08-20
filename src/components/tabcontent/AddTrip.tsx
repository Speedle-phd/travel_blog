'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Underline from '../Underline'
import { useRouter } from 'next/navigation'
import {getCookie} from 'cookies-next'
export const fileWhiteList = ['image/jpeg', 'image/png']

export const formSchema = z.object({
   destination: z.string().min(1, 'Destination is required'),
   note: z.string().optional(),
   imageUrl: z
      .any()
      .refine(
         (val) => typeof FileList !== 'undefined' && val instanceof FileList,
         {
            message: 'Invalid file list',
         }
      ),
   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

const AddTrip = () => {
   const authRole = getCookie('authRole')
   console.log(authRole)
   const router = useRouter()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         destination: '',
         note: '',
         imageUrl: undefined,
         priority: 'LOW',
      },
   })
   const {
      register,
      handleSubmit,
      setError,
      
      formState: { errors, isSubmitting },
   } = form

   const onSubmit = async(data: z.infer<typeof formSchema>) => {
      const { destination, note, imageUrl, priority } = data
      const { type } = imageUrl[0] || {}
      if (imageUrl && imageUrl.length > 0 && !fileWhiteList.includes(type)) {
         setError('imageUrl', {
            type: 'manual',
            message: `Only ${fileWhiteList.join(', ')} files are allowed.`,
         })
         return
      }
      // Here you would typically send the data to your backend
      const formData = new FormData()
      formData.append('destination', destination)
      if (note) formData.append('note', note)
      if (priority) formData.append('priority', priority)
      if (imageUrl && imageUrl.length > 0) formData.append('imageUrl', imageUrl[0])

      try {
         const response =await fetch('/api/v1/trip', {
            method: 'POST',
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
      } catch (error) {
         console.error('Error submitting form:', error)
         setError('root', {
            type: 'manual',
            message: 'Failed to add trip',
         })
      } 

   }

   return (
      
      <div>
         <h2 className='text-xl font-semibold'>Add a New Trip</h2>
         <Underline className='mx-0' />
         {errors.root && (
            <span className='text-red-500 text-sm'>{errors.root.message}</span>
         )}
         <form onSubmit={handleSubmit(onSubmit)}>
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
               <legend className='fieldset-legend'>Pick an image</legend>
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
            <button disabled={isSubmitting || authRole === "guest"} className='btn' type='submit'>
               {isSubmitting ? (
                  <span className='loading loading-ring loading-lg'></span>
               ) : (
                  'Add Trip'
               )}
            </button>
         </form>
      </div>
   )
}

export default AddTrip
