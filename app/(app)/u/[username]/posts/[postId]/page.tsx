'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
import { 
  Loader2, 
  Send, 
  MessageSquare, 
  ArrowLeft, 
  User as UserIcon,
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
import MessageCard from '@/components/MessageCard'
import Link from 'next/link'

interface Reply {
  _id: string
  content: string
  createdAt: Date
}

interface Post {
  _id: string
  username: string
  content: string
  isAcceptingMessages: boolean
  replies: Reply[]
  createdAt: Date
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const postId = params.postId as string
  const username = params.username as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [isSending, setIsSending] = useState(false)

  const isOwner = session?.user?.username === username

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await axios.get<ApiResponse & { post: Post }>(
        `/api/posts/${postId}/details`
      )
      setPost(response.data.post)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch post')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    setIsSending(true)
    try {
      await axios.post(`/api/posts/${postId}/replies`, {
        content: replyContent,
      })
      toast.success('Reply sent successfully! 🎉')
      setReplyContent('')
      fetchPost()
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || 'Failed to send reply')
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteReply = (replyId: string) => {
    if (post) {
      setPost({
        ...post,
        replies: post.replies.filter((r) => r._id !== replyId),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Post Card */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Link
                  href={`/u/${post.username}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  @{post.username}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <CardTitle className="text-2xl leading-relaxed">
              {post.content}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Reply Form or Status Messages */}
        {!isOwner && post.isAcceptingMessages && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Send Anonymous Reply</CardTitle>
              </div>
              <CardDescription>
                Your reply will be completely anonymous. Be kind and constructive! 💬
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                maxLength={300}
                rows={4}
                className="resize-none focus-visible:ring-primary"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {replyContent.length}/300 characters
                </span>
                <Button 
                  onClick={handleSendReply} 
                  disabled={isSending || !replyContent.trim()}
                  className="gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isOwner && !post.isAcceptingMessages && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="py-8 text-center space-y-2">
              <Lock className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-400" />
              <p className="font-medium">This post is not accepting replies</p>
              <p className="text-sm text-muted-foreground">
                The author has closed replies for this post.
              </p>
            </CardContent>
          </Card>
        )}

        {isOwner && (
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="py-6 text-center">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                👋 You're viewing your own post. Only you can see the replies below.
              </p>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Replies ({post.replies.length})
              </h2>
              {!isOwner && (
                <p className="text-sm text-muted-foreground mt-1">
                  Only the post owner can see these replies
                </p>
              )}
            </div>
          </div>

          {isOwner ? (
            post.replies.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">No replies yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Share your post link to start receiving anonymous replies!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {post.replies
                  .sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )
                  .map((reply) => (
                    <MessageCard
                      key={reply._id}
                      reply={reply}
                      postId={post._id}
                      onReplyDelete={handleDeleteReply}
                    />
                  ))}
              </div>
            )
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center space-y-4">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <div className="space-y-2">
                  <p className="font-medium">Replies are private</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Only @{post.username} can see the replies to this post
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}