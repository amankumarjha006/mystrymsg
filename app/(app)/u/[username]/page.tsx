"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  MessageSquare,
  User as UserIcon,
  ArrowLeft,
  Share2,
  Sparkles,
  MessageCircle,
  Plus,
  LogIn,
  Check,
  Clock,
  Quote,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { motion } from "framer-motion";

interface Post {
  _id: string;
  content: string;
  isAcceptingMessages: boolean;
  createdAt: Date;
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [username]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<
        ApiResponse & { posts: Post[]; username: string }
      >(`/api/users/${username}/posts`);
      setPosts(response.data.posts || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "User not found");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/u/${username}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied! 🔗");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          new Date(date).getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
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

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shadow-lg">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-background flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight font-display">
                @{username}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleShare}
            variant="outline"
            className="glass hover:bg-white/10 gap-2 h-11 px-6 rounded-full"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share Profile"}
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* Posts Section Header */}
        <div className="animate-slide-up delay-100">
          <h2 className="text-2xl font-bold font-display">Posts</h2>
          <p className="text-muted-foreground mt-1">
            Tap any post to send an anonymous reply
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent shadow-none text-center py-20 animate-slide-up delay-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No posts yet</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              @{username} hasn't created any posts yet. Check back later!
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 animate-slide-up delay-200">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`/u/${username}/posts/${post._id}`}
                  className="block group"
                >
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/10">
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="space-y-4 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{username}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Anonymous Host</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-4 border-l-2 border-primary/20 py-1">
                        <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20 fill-primary/10" />
                        <p className="text-lg font-medium leading-relaxed text-foreground/90 font-serif italic line-clamp-3">
                          {post.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(post.createdAt)}</span>
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

                    <CardFooter className="pt-4 border-t bg-muted/20">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full hover:bg-primary/10 hover:text-primary group-hover:bg-primary/5"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Anonymous Reply
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
