"use client"
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'

export default function Dashboard() {

  const { data: session, status } = useSession();
  console.log(session)
  if(status === "loading") {
    return <p>Loading...</p>
  }
  const rawName = session!.user!.name as string;
  const avatar = rawName.toString().split(" ");

  return (
    <div className='w-screen h-screen grid place-content-center gap-5'>
      <h1 className='text-4xl'>This is a protected route</h1>
      <Card>
          <CardHeader>
              <CardTitle className='mx-auto'>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center gap-2 text-center'>
              <Image src={session?.user?.image ? session.user.image : `https://ui-avatars.com/api/?name=${avatar[0].toString()}+${avatar[1].toString()}?size=&background=random&rounded=true`} alt={avatar[0]+" "+avatar[1]} width={50} height={50} className='mx-auto rounded-full'/>
              <p>{session?.user?.name}</p>
              <p>{session?.user?.email}</p>
            </div>
          </CardContent>
      </Card>
      <Button className='mx-auto' onClick={() => signOut()}>Log Out</Button>
    </div>
  )
}
