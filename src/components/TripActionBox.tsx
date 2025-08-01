
"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  id: string
}

const TripActionBox = ({id} : Props)=> {
   const [loading, setLoading] = React.useState(false)
   const [error, setError] = React.useState<string | null>(null)
   const router = useRouter()
   const handleVisit = async() => {
      setLoading(true)
      try {
         const response = await fetch(`/api/v1/trip`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, currentTrip: true, upcomingTrip: false, finishedTrip: false }),
         })
         if (!response.ok) {
            const errorData = await response.json()
            setError(errorData.error || 'Failed to visit trip')
            throw new Error('Failed to edit trip')
         }
         router.push('/blog')
      } catch (error) {
         console.error('Error editing trip:', error)
      } finally {
         setLoading(false)
      }
   }
   const handleDelete = async() => {
      setLoading(true)

      try {
         const response = await fetch("/api/v1/trip", {
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
      } catch(error){
         console.error('Error deleting trip:', error)
      } finally {
         setLoading(false)
      }
   }
   const handleEdit = () => {
      console.log(id)
   }

   useEffect(() => {
      const timeout: NodeJS.Timeout = setTimeout(() => {
         setError(null)
      }, 3000)
      return () => clearTimeout(timeout)
   }, [error])

  return (

    <div className='card-actions justify-end mt-4'>
      {error && <aside className='bg-base-100 p-4 rounded-lg border-2 border-red-700 absolute z-50 top-2 left-1/2 transform -translate-x-1/2 text-sm'>{error}</aside>}
      <button disabled={loading} className="btn rounded btn-warning" onClick={handleEdit}>{loading ? <span className="loading loading-spinner"></span> : 'Edit'}</button>
      <button disabled={loading} className="btn rounded btn-error" onClick={handleDelete}>{loading ? <span className="loading loading-spinner"></span> : 'Delete'}</button>
      <button disabled={loading} className='btn rounded btn-primary' onClick={handleVisit}>{loading ? <span className="loading loading-spinner"></span> : 'Visit'}</button>
    </div>
  )
}

export default TripActionBox
