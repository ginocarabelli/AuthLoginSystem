"use client"
import LogIn from "@/components/log-in";
import Register from "@/components/register";
import Loader from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";

export default function Login() {
  
  const [isLoading, setIsLoading] = useState(false);

  if(isLoading){
    return (
      <div className='max-w-96 grid place-content-center'>
        <Loader/>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen grid place-content-center my-auto">
      <Tabs defaultValue="login">
        <TabsList className="w-full bg-neutral-300">
          <TabsTrigger value="login" className="cursor-pointer">Log In</TabsTrigger>
          <TabsTrigger value="register" className="cursor-pointer">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LogIn setIsLoading={setIsLoading} />
        </TabsContent>
        <TabsContent value="register">
          <Register setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}