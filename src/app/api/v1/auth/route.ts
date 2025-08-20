import { cookies } from "next/headers";



export async function POST(req: Request){
   const cookieStore = await cookies()
   const {authRole} = await req.json()
   cookieStore.set("authRole", authRole)
   return new Response(JSON.stringify({authRole}), {
      headers: { "Content-Type": "application/json" },
   })
}