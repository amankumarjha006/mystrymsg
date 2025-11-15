'use client'

import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, useSonner } from 'sonner'
import * as z from 'zod'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const verifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toasts } = useSonner()
     const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
        code: ""  // Add this!
    }
});

   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    
    console.log('=== DEBUG INFO ===')
    console.log('Username from params:', params.username)
    console.log('Code from form:', data.code)
    console.log('API URL:', '/api/verify-code')
    
    try {
        const response = await axios.post('/api/verify-code', {
            username: params.username,
            code: data.code
        })
        
        console.log('Success response:', response.data)
        toast.success("Account verified successfully!")
        router.replace('/sign-in')
    } catch (error) {
        console.error("Full error object:", error);
        const axiosError = error as AxiosError<ApiResponse>;
        console.log('Error response:', axiosError.response?.data)
        console.log('Error status:', axiosError.response?.status)
        toast.error(axiosError.response?.data.message ?? "Verification failed");
    } finally {
        setIsSubmitting(false)
    }
}

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'suppressHydrationWarning>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter code "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mx-auto flex p-5 items-center"
            >
              {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ):("Submit")}
            </Button>
          </form>
        </Form>
            </div>

        </div>
    )
}

export default verifyAccount
