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
  MessageCircle,
  ArrowLeft,
  User as UserIcon,
  Clock,
  Lock,
  PenSquare,
  Sparkles,
  Quote,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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

  // AI Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)

  const isOwner = session?.user?.username === username

  useEffect(() => {
    fetchPost()
  }, [postId])

  // Load initial suggestions when post is loaded
  useEffect(() => {
    if (post && !isOwner && post.isAcceptingMessages && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [post?.content, isOwner]);

  const fetchPost = async () => {
    try {
      const response = await axios.get<ApiResponse & { post: Post }>(
        `/api/posts/${postId}/details`
      )
      setPost(response.data.post)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReplyContent(value);
  };

  const fetchSuggestions = async () => {
    if (!post) return;


    setIsSuggesting(true);
    try {
      const response = await axios.post('/api/suggest-messages', {
        postContent: post.content,
        userDraft: replyContent
      });

      const text = response.data.suggestions;


      if (text) {
        const newSuggestions = text.split('||')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
          .slice(0, 3);
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Failed to fetch suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60))
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 -ml-2 hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Post Card (Matched Design) */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/10 animate-fade-in">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <CardHeader className="space-y-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <Link href={`/u/${post.username}`} className="text-sm font-semibold hover:underline">
                    {post.username}
                  </Link>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Anonymous Host</span>
                </div>
              </div>
            </div>

            <div className="relative pl-4 border-l-2 border-primary/20 py-1">
              <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20 fill-primary/10" />
              <p className="text-lg font-medium leading-relaxed text-foreground/90 font-serif italic">
                {post.content}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <MessageCircle className="h-3 w-3" />
                <span>{post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
              </div>

              {post.isAcceptingMessages ? (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
                  <XCircle className="h-3 w-3" />
                  Closed
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Reply Form or Status Messages */}
        {!isOwner && post.isAcceptingMessages && (
          <div className="animate-slide-up delay-100 space-y-4">
            <Card className="glass-card border-none shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-cyan-500/50 to-teal-500/50" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PenSquare className="h-5 w-5 text-primary" />
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
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={4}
                  className="bg-background/50 border-white/10 focus:border-primary/50 resize-none text-lg p-4 rounded-xl transition-all"
                />

                {/* AI Suggestions */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>AI Suggestions (tap to use)</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2"
                      onClick={fetchSuggestions}
                      disabled={isSuggesting}
                    >
                      <RotateCcw className={`h-3 w-3 ${isSuggesting ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyContent(suggestion)}
                        className="text-xs rounded-full bg-primary/5 hover:bg-primary/10 border-primary/10"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {replyContent.length}/500 characters
                  </span>
                  <Button
                    onClick={handleSendReply}
                    disabled={isSending || !replyContent.trim()}
                    className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isOwner && !post.isAcceptingMessages && (
          <Card className="border-yellow-500/50 bg-yellow-500/5 animate-slide-up delay-100">
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
          <Card className="border-blue-500/50 bg-blue-500/5 animate-slide-up delay-100">
            <CardContent className="py-2 text-center">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-500">
                👋 You're viewing your own post. Only you can see the replies below.
              </p>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8 opacity-50" />

        {/* Replies Section */}
        <div className="space-y-6 animate-slide-up delay-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 font-display">
                <MessageCircle className="h-5 w-6 text-primary" />
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
              <Card className="border-dashed border-2 bg-transparent shadow-none">
                <CardContent className="py-16 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
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
            <Card className="border-dashed border-2 bg-transparent shadow-none">
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