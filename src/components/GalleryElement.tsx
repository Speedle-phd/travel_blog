"use client"
import { X } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGallery } from '@/context/GalleryProvider'
interface Props {
   image: string
   destinationName: string
   index: number
   id: string
   images?: string[]
}

const GalleryElement = ({ image, destinationName, index, id, images }: Props) => {
   const { openGallery } = useGallery()
   const router = useRouter()
   const handleDelete = async() => {
      // Logic to delete the image
      console.log(`Delete image: ${image} from ${destinationName} with ID: ${id}`);
      try {
         await fetch(`/api/v1/gallery`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tripId: id, imageName: image }),
         });

         router.refresh();
      } catch (error) {
         console.error('Error deleting image:', error);
      }
   }
   return (
      <>
         <div key={index} className='w-full h-48 relative cursor-zoom-in'>
            <a href={`#item${index}`}>
               <Image
                  src={`/${image}`}
                  alt={`${destinationName} Gallery Image ${index + 1}`}
                  fill
                  className='object-cover object-center rounded-lg'
                  onClick={() => openGallery(images!.slice(1))}
               />
            </a>
            <X
               onClick={handleDelete}
               className='absolute top-2 right-2 cursor-pointer hover:bg-red-700 transition-colors text-white rounded-full z-50'
            />
         </div>
      </>
   )
}

export default GalleryElement
