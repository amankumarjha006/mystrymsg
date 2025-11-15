'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Loader2, Plus, MessageSquare, Share2, Trash2, ExternalLink } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'

interface Reply {
  _id: string
  content: string
  createdAt: Date
}

interface Post {
  _id: string
  content: string
  isAcceptingMessages: boolean
  replies: Reply[]
  createdAt: Date
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-in')
    }
  }, [status, router])

  const fetchPosts = useCallback(async () => {
    if (!session) return
    
    try {
      const response = await axios.get<ApiResponse & { posts: Post[] }>('/api/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session, fetchPosts])

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter post content')
      return
    }

    setIsCreating(true)
    try {
      await axios.post('/api/posts', { content: newPostContent })
      toast.success('Post created successfully!')
      setNewPostContent('')
      fetchPosts()
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || 'Failed to create post')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleMessages = async (postId: string, currentState: boolean) => {
    try {
      await axios.patch(`/api/posts/${postId}/toggle-messages`, {
        isAcceptingMessages: !currentState,
      })
      toast.success(
        !currentState ? 'Now accepting replies' : 'Stopped accepting replies'
      )
      fetchPosts()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || 'Failed to update settings')
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post and all its replies?')) {
      return
    }

    try {
      await axios.delete(`/api/posts/${postId}`)
      toast.success('Post deleted successfully')
      fetchPosts()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || 'Failed to delete post')
    }
  }

  const copyPostLink = (postId: string) => {
    const link = `${window.location.origin}/u/${session?.user?.username}/posts/${postId}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.username}!
        </p>
      </div>

      {/* Create New Post */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>
            Share a question or thought. People can reply anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's on your mind? Ask a question or share a thought..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            maxLength={500}
            rows={4}
            className="mb-4"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {newPostContent.length}/500
            </span>
            <Button onClick={handleCreatePost} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User's Posts */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <p className="text-sm text-muted-foreground">
          Manage your posts and view replies
        </p>
      </div>
      
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <p className="text-sm">Create your first post above to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post._id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.content}</CardTitle>
                    <CardDescription>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={post.isAcceptingMessages}
                      onCheckedChange={() =>
                        handleToggleMessages(post._id, post.isAcceptingMessages)
                      }
                    />
                    <span className="text-sm">
                      {post.isAcceptingMessages
                        ? 'Accepting replies'
                        : 'Not accepting replies'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPostLink(post._id)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/u/${session?.user?.username}/posts/${post._id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Replies
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {post.replies.length} Anonymous {post.replies.length === 1 ? 'Reply' : 'Replies'}
                    </span>
                  </div>
                  {post.replies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No replies yet. Share your post link to get responses!
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click "View Replies" to see all responses
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}