

import AuthButton from "@/components/AuthButton";
import Underline from "@/components/Underline";


export default function Home() {
   const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD!

   return (
      <div
         className={`flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-image`}
      >
         <div className='bg-white/40 rounded-md backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100 w-[clamp(20rem,50vw,40rem)] shadow-lg h-auto p-6 flex flex-col items-center'>
            <header className='font-indie text-gray-900'>
               <h1 className='text-center text-4xl font-bold'>
                  Welcome to Nadine&apos;s and Emanuel&apos;s Travel Blog!
               </h1>
               <p className="text-center text-xl mt-4">
                  A place of destination, adventures and memories.
               </p>
            </header>
            <Underline className="" />
            <AuthButton password={PASSWORD} />

         </div>
      </div>
   )
}
