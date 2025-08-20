"use client"
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
   id: string
   isFavorite: boolean | undefined | null
}
const FavButton = ({id, isFavorite} : Props) => {
   const authRole = getCookie('authRole')

   const router = useRouter()
   const [loading, setLoading] = React.useState(false)
   const handleClick = async() => {
      if (authRole === "guest") return
      setLoading(true)
      try {
         const response = await fetch('/api/v1/trip', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, favorite: isFavorite ? false : true }),
         })
         if (!response.ok) {
            throw new Error('Failed to add to favorites')
         }
         router.refresh()
      } catch (error) {
         console.error('Error adding to favorites:', error)

      } finally {
         setLoading(false)
      }
   }
  return (
    <button disabled={loading} onClick={handleClick} className="btn self-start min-w-[17ch]">
               {
               !loading ? isFavorite ? 'Remove from Favorites' : 'Add to Favorites' : <span className="loading loading-ring loading-md"></span>
               }
            </button>
  )
}

export default FavButton