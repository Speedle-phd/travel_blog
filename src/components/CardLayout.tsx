import { headers } from 'next/headers'
import React from 'react'
import {cn} from '@/lib/utils'
const routes = ["/upcoming", "/blog", "/journal"]

type Props = {
   children: React.ReactNode
}
const CardLayout = async({ children }: Props) => {
   const headerList = await headers()
   const currentPath = headerList.get('x-current-path') || ''
   console.log(currentPath)
  return (
     <div className={cn('my-28 md:my-24 py-24 md:py-30 md:px-10 px-5 border-[1px] border-neutral w-[clamp(15rem,90vw,70rem)] bg-base-200 rounded-sm card-bg-image background-blur-sm', 
      !routes.includes(currentPath) ? "" : ""
     )}>
        {children}
     </div>
  )
}

export default CardLayout
