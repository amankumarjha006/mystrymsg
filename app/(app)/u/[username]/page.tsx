'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  MessageSquare, 
  User as UserIcon, 
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Share2
} from 'lucide-react'
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
      const response = await axios.get<ApiResponse & { posts: Post[]; username: string }>(
        `/api/users/${username}/posts`
      )
      setPosts(response.data.posts || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'User not found')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/u/${username}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${username}'s Profile`,
          url: profileUrl,
        })
      } else {
        await navigator.clipboard.writeText(profileUrl)
        toast.success('Profile link copied! 🔗')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-primary/20 shadow-lg">
            <UserIcon className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              @{username}
            </h1>
            <p className="text-muted-foreground text-lg">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} • Public Profile
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
        </div>

        {/* Posts Section Header */}
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Posts</h2>
          <p className="text-muted-foreground">
            Click on any post to send an anonymous reply
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-20 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xl">No posts yet</p>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  @{username} hasn't created any posts yet. Check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/u/${username}/posts/${post._id}`}
                className="block group"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                  <CardHeader className="space-y-4">
                    {/* Post Content */}
                    <div className="space-y-3">
                      <CardTitle className="text-lg leading-relaxed group-hover:text-primary transition-colors">
                        {post.content}
                      </CardTitle>
                      
                      {/* Post Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        
                        <span>•</span>
                        
                        {post.isAcceptingMessages ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Accepting replies
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted">
                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              Closed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>Send anonymous reply</span>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {posts.length > 0 && (
          <div className="mt-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Want to create your own?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sign up and start receiving anonymous feedback on your posts!
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/sign-up">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}