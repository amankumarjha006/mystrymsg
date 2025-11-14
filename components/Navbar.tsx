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
    <nav className="border-b bg-background py-4 w-full">
      <div className="container mx-auto w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold">
          Mystery Message
        </Link>

        {/* Auth Section */}
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-sm">
              Welcome, {user?.username || user?.email}
            </span>
            <Button 
              className="w-full md:w-auto" 
              onClick={() => signOut()}
              variant="outline"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full md:w-auto">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar