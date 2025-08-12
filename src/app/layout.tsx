import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from '../context/ThemeProvider'
import SwapTheme from '@/components/SwapTheme'
import { GalleryProvider } from '@/context/GalleryProvider'

export const metadata: Metadata = {
   title: 'Travel Blog of Nadine and Emanuel',
   description: 'A blog about our travels',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <ThemeProvider>
         <html lang='en' data-theme='nord'>
            <body className='min-h-[100dvh]'>
               <GalleryProvider>
                  {children}
                  <SwapTheme />
               </GalleryProvider>
            </body>
         </html>
      </ThemeProvider>
   )
}
