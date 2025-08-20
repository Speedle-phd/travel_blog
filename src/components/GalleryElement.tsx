'use client'
import { X } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGallery } from '@/context/GalleryProvider'
import { getCookie } from 'cookies-next'
interface Props {
   image: string
   destinationName: string
   index: number
   id: string
   images?: string[]
}

const GalleryElement = ({
   image,
   destinationName,
   index,
   id,
   images,
}: Props) => {
   const authRole = getCookie('authRole')
   const { openGallery } = useGallery()
   const router = useRouter()
   const handleDelete = async () => {
      // Logic to delete the image
      if(authRole === "guest") return
      try {
         await fetch(`/api/v1/gallery`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tripId: id, imageName: image }),
         })

         router.refresh()
      } catch (error) {
         console.error('Error deleting image:', error)
      }
   }
   return (
      <>
         <div
            key={index}
            className='w-full h-48 relative cursor-zoom-in rounded-xl overflow-hidden'
         >
            <a href={`#item${index}`}>
               <Image
                  src={`${process.env.NEXT_PUBLIC_STATIC}${
                     image || 'default-trip-image.jpg'
                  }`}
                  alt={`${destinationName} Gallery Image ${index + 1}`}
                  fill
                  className='p-1 object-contain object-center rounded-xl bg-base-100/20 hover:bg-base-100/50 transition-all duration-300 ease-in-out shadow-lg'
                  onClick={() => openGallery(images!.slice(1), index)}
               />
            </a>
            <X
               onClick={handleDelete}
               className='absolute top-2 right-2 cursor-pointer hover:bg-red-700 transition-colors text-white rounded-full'
            />
         </div>
      </>
   )
}

export default GalleryElement
