import React from 'react'
import CardSkeleton from '@/components/card-skeleton';

export default function Loading() {
  return (
    <div className='w-screen h-screen grid place-content-center'>
      <CardSkeleton/>
    </div>
  )
}
