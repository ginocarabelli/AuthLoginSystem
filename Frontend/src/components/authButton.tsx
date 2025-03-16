"use client"
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function AuthButton() {

    const { data: session, status } = useSession()

    if(status === 'loading'){
        return <p>Loading...</p>
    }

    return (
        <div className='w-full flex justify-center my-2 cursor-pointer'>
        {session ? (
            <Button onClick={() => signOut()}>
                Sign Out
            </Button>
        ) : (
            <Link href={"/login"}>
                <Button>
                Log In
                </Button>
            </Link>
        )}
        </div>
  )
}
