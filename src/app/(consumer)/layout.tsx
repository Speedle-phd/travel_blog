import Navigation from '@/components/Navigation'
import React from 'react'
import CardLayout from '@/components/CardLayout'
import Header from '@/components/Header'

const BlogLayout = async ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="flex flex-col items-center overflow-y-scroll min-h-screen">
         <Header />
         <Navigation />
         <div className='flex justify-center items-center flex-col'>
            <CardLayout>{children}</CardLayout>
         </div>
      </div>
   )
}

export default BlogLayout
