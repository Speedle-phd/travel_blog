"use client"
import { cn } from '@/lib/utils'
import { MapPin, Notebook, TentTree } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const Navigation = () => {
   const navigate = useRouter()
   const handleNavigation = (newPath: string) => {
      if (path !== newPath) {
         navigate.push(newPath)
      }
   }
   const path = usePathname()
   return (
      <div className='dock bg-neutral text-neutral-content'>
         <button className={cn({ 'dock-active': path === '/blog' })} onClick={() => handleNavigation('/blog')}>
            <MapPin />
            <span className='dock-label'>Current journey</span>
        </button>

        <button className={cn({ 'dock-active': path === '/upcoming' })} onClick={() => handleNavigation('/upcoming')}>
           <TentTree />
           <span className='dock-label'>Upcoming Destinations</span>
        </button>

        <button className={cn({ 'dock-active': path === '/journal' })} onClick={() => handleNavigation('/journal')}>
        <Notebook />
           <span className='dock-label'>Travel Journal</span>
        </button>
     </div>
  )
}

export default Navigation
