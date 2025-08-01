import { Heart, Map } from 'lucide-react'
import React from 'react'

const Header = () => {
   return (
      <div className='fixed top-0 z-50 bg-base-200 p-4 border-b border-neutral w-[100vw] flex items-center'>
         <div className='text-md md:text-2xl font-bold font-indie ml-2'>
            Nadine&apos;s and Emanuel&apos;s Travel Blog
         </div>
         <Map className='ml-4 text-gray-500 w-4 md:w-8' />
         <Heart className='ml-2 text-gray-500 w-4 md:w-8' />
      </div>
   )
}

export default Header
