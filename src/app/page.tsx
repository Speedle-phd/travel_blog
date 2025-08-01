

import Underline from "@/components/Underline";
import Link from "next/link";

export default function Home() {


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
            <Link href='/blog'>
               <button className="mt-4 px-4 py-2 bg-petrol  rounded-md btn border-gray-800 text-gray-200 hover:bg-white hover:border-petrol transition-colors hover:text-petrol">Head to the Blog</button>
            </Link>
         </div>
      </div>
   )
}
