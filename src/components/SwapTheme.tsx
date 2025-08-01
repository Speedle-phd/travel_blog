"use client"
import React from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { CloudMoon, CloudSun } from 'lucide-react'
const SwapTheme = () => {
   const [theme, setTheme] = useLocalStorage('theme', 'nord')
   const toggleTheme = () => {
      setTheme(theme === 'nord' ? 'sunset' : 'nord')
   }
   return (
      <aside className='opacity-80 bg-petrol border border-gray-300 text-gray-300 rounded-sm fixed top-2 right-2 p-1 z-100'>
         <label className='swap swap-rotate'>
            {/* this hidden checkbox controls the state */}
            <input type='checkbox' checked={theme === 'sunset'} onChange={toggleTheme} />

            {/* sun icon */}
            <CloudSun
               className='swap-on h-6 w-6 fill-current'
            />
            {/* moon icon */}
            <CloudMoon className="swap-off h-6 w-6 fill-current"/>
         </label>
      </aside>
   )
}

export default SwapTheme
