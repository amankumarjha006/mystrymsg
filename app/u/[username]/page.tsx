'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, MessageSquare, User as UserIcon } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'

interface Post {
  _id: string
  content: string
  isAcceptingMessages: boolean
  createdAt: Date
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [username])

  const fetchPosts = async () => {
    try {
      const response = await axios.get<
        ApiResponse & { posts: Post[]; username: string }
      >(`/api/users/${username}/posts`)
      setPosts(response.data.posts || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'User not found')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
          <UserIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">@{username}</h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* Posts Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Posts</h2>
        <p className="text-sm text-muted-foreground">
          Click on any post to send an anonymous reply
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <p className="text-sm">@{username} hasn't created any posts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/u/${username}/posts/${post._id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <Card className="cursor-pointer hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {post.content}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {post.isAcceptingMessages ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                            • Accepting replies
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            • Not accepting replies
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
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