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
import { Loader2, Send, MessageSquare, ArrowLeft } from 'lucide-react'
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
      toast.success('Reply sent successfully!')
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="mb-2">
                Posted by{' '}
                <Link
                  href={`/u/${post.username}`}
                  className="font-medium hover:underline"
                >
                  @{post.username}
                </Link>
              </CardDescription>
              <CardTitle className="text-2xl mb-2">{post.content}</CardTitle>
              <CardDescription>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isOwner && post.isAcceptingMessages && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send Anonymous Reply</CardTitle>
            <CardDescription>
              Your reply will be completely anonymous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={300}
              rows={4}
              className="mb-4"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {replyContent.length}/300
              </span>
              <Button onClick={handleSendReply} disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOwner && !post.isAcceptingMessages && (
        <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              This post is not currently accepting replies
            </p>
          </CardContent>
        </Card>
      )}

      {isOwner && (
        <Card className="mb-8 border-blue-500/50 bg-blue-500/10">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              You're viewing your own post. Replies are visible only to you.
            </p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Replies ({post.replies.length})
        </h2>
        {!isOwner && (
          <p className="text-sm text-muted-foreground mt-1">
            Only the post owner can see these replies
          </p>
        )}
      </div>

      {isOwner ? (
        post.replies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No replies yet</p>
              <p className="text-sm">
                Share your post link to start receiving anonymous replies!
              </p>
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
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Replies are private and only visible to @{post.username}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}