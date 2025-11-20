'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2, MessageSquare, User as UserIcon } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface Post {
  _id: string
  content: string
  isAcceptingMessages: boolean
  createdAt: Date
}

export default function PublicProfilePage() {
  const { username } = useParams() as { username: string }

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [username])

  const fetchPosts = async () => {
    try {
      const res = await axios.get<
        ApiResponse & { posts: Post[]; username: string }
      >(`/api/users/${username}/posts`)
      setPosts(res.data.posts || [])
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse>
      toast.error(axiosErr.response?.data.message || 'User not found')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Profile Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <UserIcon className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-semibold mt-3">@{username}</h1>

        <p className="text-muted-foreground text-sm mt-1">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* Posts Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        <p className="text-xs text-muted-foreground">
          Tap a post to send an anonymous reply
        </p>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-card/40 shadow-sm backdrop-blur-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-base mb-1">No posts yet</p>
            <p className="text-xs">@{username} has not posted anything</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/u/${username}/posts/${post._id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <Card className="cursor-pointer bg-card/50 hover:border-primary/40 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium mb-1 line-clamp-2">
                        {post.content}
                      </CardTitle>

                      <CardDescription className="text-[11px] flex items-center gap-2">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}

                        <span
                          className={
                            post.isAcceptingMessages
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-muted-foreground'
                          }
                        >
                          • {post.isAcceptingMessages ? 'Accepting replies' : 'Closed'}
                        </span>
                      </CardDescription>
                    </div>

                    <MessageSquare className="h-4 w-4 text-muted-foreground opacity-70" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
