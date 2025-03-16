import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function CardSkeleton() {
  return (
    <div className='flex flex-col gap-3'>
        <div className="sk-tabs flex justify-between bg-neutral-300 p-3 rounded-xl">
            <Skeleton style={{ width: "175px", height: "25px"}}/>
            <Skeleton style={{ width: "175px", height: "25px"}}/>
        </div>
        <div className='card-skeleton min-w-96 bg-neutral-300 p-3 rounded-xl flex flex-col gap-3'>
        <div className="sk-header">
            <div className="sk-title mb-2">
                <Skeleton style={{ width: "50%", height: "25px"}}/>
            </div>
            <div className="sk-desc">
                <Skeleton style={{ width: "100%", height: "25px"}}/>
            </div>
        </div>
        <div className="sk-content">
            <div className="sk-form">
                <Skeleton count={2} style={{ width: "100%", height: "50px" }} className='mb-3'/>
            </div>
            <div className="sk-button mb-4">
                <Skeleton style={{ width: "100%", height: "40px"}}/>
            </div>
            <div className="sk-button">
                <Skeleton style={{ width: "100%", height: "40px"}}/>
            </div>
        </div>
        </div>
    </div>
  )
}
