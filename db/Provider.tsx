"use client"

import { SessionProvider } from "next-auth/react"

//whenever we have client side provider it is always good practice to put it into client componenet and then use it on server component

export function Providers({children}:{children:React.ReactNode}){
    return <SessionProvider>
        {children}
    </SessionProvider>
}