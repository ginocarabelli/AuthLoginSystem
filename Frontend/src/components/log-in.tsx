"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, loginSubmit } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LogIn({ setIsLoading } : { setIsLoading: (loading: boolean) => void } ) {

    const router = useRouter();
    const [message, setMessage] = useState("");

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        const result = await loginSubmit(values);
        if(result?.status === 200){
            router.push("/dashboard")
        } else if(result?.status === 401){
            setMessage("Invalid Credentials")
        } else {
            setMessage(result?.error as string)
        }
    }
    
    const onProviderLogin = async (provider : string) => {
        setIsLoading(true)
        await signIn(provider, {
            redirect: false,
            callbackUrl: "/dashboard"
        });
    }

    return (
        <div className='max-w-96'>
            <Card>
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                    <CardDescription>Complete the formulary with your user credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-3">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type='password'/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <p className='text-red-500'>{message}</p>
                            <Button type="submit" className='cursor-pointer w-full'>Log In</Button>
                        </form>
                    </Form>
                    <div className='w-full h-0.5 bg-neutral-200 rounded-xl my-3'></div>
                    <Button type='button' className='w-full py-5' onClick={() => onProviderLogin("google")}>
                        Log In with google
                    </Button>
                </CardContent>
            </Card>
        </div>
  )
}
