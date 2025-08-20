'use client'

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
type Props = {
   password: string
}
const AuthButton = ({password} : Props) => {
   const router = useRouter()
   const inputRef = useRef<HTMLInputElement>(null)
   const [isModal, setIsModal] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const handleClick = () => {
      setIsModal(true)
   }
   const closeModal = () => {
      setIsModal(false)
   }
   const handleGuestAccess = async() => {
      try {
         const response = await fetch('/api/v1/auth', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authRole: "guest" }),
         })
         if(response.ok){
            router.push('/blog')
            closeModal()
         }
         
      } catch (error) {
         console.error("Failed to authenticate", error)
         setError("Failed to authenticate")
      }
   }
   const handleAdminAccess = async() => {
      
      if (!inputRef.current) return
      if (inputRef.current.value !== password){
         setError("Incorrect password")
         return
      }
      try {
         const response = await fetch('/api/v1/auth', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authRole: "admin" }),
         })
         if (response.ok){
            router.push('/blog')
            closeModal()
         }
      } catch (error) {
         console.error("Failed to authenticate", error)
         setError("Failed to authenticate")
      }
   }

   useEffect(() => {
      setTimeout(() => {
         setError(null)
      }, 5000)
   }, [error])

   return (
      <>
      {isModal && (
         <aside className="bg-base-100/90 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-md shadow-lg flex flex-col items-center w-[clamp(200px,60vw,500px)]">
            <h2 className="font-indie text-lg font-bold mb-4">Either enter the correct password or join our trips as our guest :)</h2>
            <div className="grid gap-4">
               <div className="grid gap-2">
                  <input ref={inputRef} type="text" className="input" placeholder="Password..." />
                  <button onClick={handleAdminAccess} className="btn btn-info">Join as admin</button>
               </div>
               <button onClick={handleGuestAccess} className="btn btn-accent">Join as guest</button>
               <button onClick={closeModal} className="btn btn-warning">Cancel</button>
               {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
         </aside>
      )}
      <button onClick={handleClick} className='mt-4 px-4 py-2 bg-petrol  rounded-md btn border-gray-800 text-gray-200 hover:bg-white hover:border-petrol transition-colors hover:text-petrol'>
         Head to the Blog
      </button>
      </>
   )
}

export default AuthButton
