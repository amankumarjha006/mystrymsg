'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageSquare,
  Share2,
  ExternalLink,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'

interface PostCardProps {
  postId: string
  content: string
  createdAt: Date
  isAcceptingMessages: boolean
  repliesCount: number
  username: string
  onToggleAccepting: () => void
  onDelete: () => void
}

export default function PostCard({
  postId,
  content,
  createdAt,
  isAcceptingMessages,
  repliesCount,
  username,
  onToggleAccepting,
  onDelete,
}: PostCardProps) {

  const router = useRouter()
  const { data: session } = useSession()

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const handleShare = async () => {
    const username = session?.user?.username;
    if (!username) {
      toast.error("Username missing");
      return;
    }

    const profileUrl = `${window.location.origin}/u/${username}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my profile!",
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleViewReplies = () => {
    router.push(`/u/${username}/posts/${postId}`)
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

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <p className="text-base leading-relaxed">{content}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(createdAt)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAcceptingMessages ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Accepting replies
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted">
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Closed
                  </span>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem onClick={handleViewReplies}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Replies
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Delete Post -> opens modal */}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 px-3 py-2 rounded-lg bg-muted/50">
            <label
              htmlFor={`toggle-${postId}`}
              className="text-sm font-medium cursor-pointer select-none"
            >
              Accept replies
            </label>
            <Switch
              id={`toggle-${postId}`}
              checked={isAcceptingMessages}
              onCheckedChange={onToggleAccepting}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1 sm:flex-none gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="sm:inline">Share</span>
            </Button>

            <Button
              size="sm"
              onClick={handleViewReplies}
              className="flex-1 sm:flex-none gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="sm:inline">View</span>
              <span className="hidden sm:inline">({repliesCount})</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* FULL SCREEN DELETE CONFIRMATION */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete()
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
