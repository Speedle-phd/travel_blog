"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"

const FilterFavButton = () => {
   const [loading, setLoading] = useState(false)
   const searchQueries = useSearchParams()
   const filterForFavorites = searchQueries.get('favorites') ?? false

   const router = useRouter()

   const toggleFavorites = () => {
      setLoading(true)
      const newValue = filterForFavorites === 'true' ? 'false' : 'true'
      
      router.push(`?favorites=${newValue}`)
      setLoading(false)
   }

   return (
      <button disabled={loading} onClick={toggleFavorites} className="btn">
         {!loading ? filterForFavorites === "true" ? 'Show All' : 'Show Favorites' : <span className="loading loading-ring loading-md"></span>}
      </button>
   )
}

export default FilterFavButton