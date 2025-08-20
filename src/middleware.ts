
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

   const cookieStore = await cookies()
   const authRole = cookieStore.get("authRole")
   console.log(authRole)

   const headers = new Headers(request.headers)
   headers.set('x-current-path', request.nextUrl.pathname)


   console.log("TEST: " + request.nextUrl.pathname)
   if (request.nextUrl.pathname !== "/"){
      if (!authRole) {
         console.log("No Auth Role found")
         // If no authRole is found, redirect to the login page
         return NextResponse.redirect(new URL('/', request.url))
      }
      
   }



   return NextResponse.next({ headers })
}

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}