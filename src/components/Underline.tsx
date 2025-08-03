import React from 'react'
import {cn} from '@/lib/utils'
const Underline = ({className} : {className?: string}) => {
  return (
    <div className={cn("my-2 h-1 w-[200px] bg-petrol mx-auto rounded-[10px/70%] ", className)}></div>
  )
}

export default Underline