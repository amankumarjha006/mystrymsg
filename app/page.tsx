"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, MessageCircle, Shield, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Post } from "@/model/Post";

export default function LandingPage() {
  const { data: session, status } = useSession();
    const router = useRouter();
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    // ... rest of state

    // Add this useEffect at the top
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);


  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden pt-16 ">
        {/* Hero Section */}
        <section className="relative pt-16 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-0" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Anonymous Feedback Reimagined</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground animate-slide-up">
              Speak Freely, <br />
              <span className="text-gradient">Listen deeply.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-100">
              Create your space, share your link, and receive honest, anonymous feedback from your community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up delay-200">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" asChild>
                <Link href="/sign-up">Get Your Link</Link>
              </Button>
                <Link href="/explore">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base glass hover:bg-white/10" >
              <Compass className="h-5 w-5 mr-1" />
              Explore
              </Button>
                </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-16 animate-fade-in delay-300">
              <div className="glass-card p-6 rounded-2xl text-left space-y-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-500">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">True Anonymity</h3>
                <p className="text-sm text-muted-foreground">Built with privacy first. Your identity is protected, encouraging honest and open communication.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-left space-y-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Direct Replies</h3>
                <p className="text-sm text-muted-foreground">Engage with your audience. Reply to messages publicly or keep them for your eyes only.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-left space-y-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-500">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">AI Suggestions</h3>
                <p className="text-sm text-muted-foreground">Stuck on what to ask? Let our AI suggest engaging questions to spark conversation.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
