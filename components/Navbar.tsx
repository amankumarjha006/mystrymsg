"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="border-b bg-black py-4 text-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Mystery Message
        </Link>

        {/* Auth Section */}
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-4 ">
            <span className="text-sm">
              Welcome, {user?.username || user?.email}
            </span>
            <Button 
              className="w-full md:w-auto" 
              onClick={() => signOut()}
              variant="white"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full md:w-auto" variant= "white">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar