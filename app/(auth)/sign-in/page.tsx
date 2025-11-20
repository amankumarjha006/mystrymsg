"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast, useSonner } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

import ThemeToggle from "@/components/theme-toggle";

const Page = () => {
  const { toasts } = useSonner();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Invalid username or password. Please try again.");
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div
      className="
        flex justify-center items-center min-h-screen 
        bg-linear-to-br 
        from-[#ffffff] to-[#f3f3f3] 
        dark:bg-black dark:from-black dark:to-black
        transition-colors relative
      "
    >
      {/* THEME TOGGLE BUTTON */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div
        className="
          w-full max-w-md p-8 space-y-8 rounded-lg 
          shadow-lg 
          bg-white/80 
          dark:bg-[#1a1a1a]/90 
          backdrop-blur 
          border border-black/10 dark:border-white/10
          transition-all
        "
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="text-muted-foreground">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form
            id="form-rhf-demo"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mx-auto flex p-5 items-center">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-2">
          <p>
            New to Mystery Message?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
