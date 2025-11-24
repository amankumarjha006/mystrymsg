"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { toast } from "sonner";
import {
  Share2,
  Menu,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ChevronDown,
  LogIn,
  Sparkles,
  Compass
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isOpen, setIsOpen] = useState(false);

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
        toast.success("Profile link copied! 🔗");
      }
    } catch {
      toast.error("Share failed");
    }
    setIsOpen(false);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
  };

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ElementType }) => (
    <Link
      href={href}
      className="relative group flex items-center gap-2 px-1 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 dark:border-white/5 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <Image src="/logo.png" alt="EchoInbox Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all">
            EchoInbox
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/explore" icon={Compass}>Explore</NavLink>
          {session && (
            <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
          )}

          <div className="h-6 w-px bg-border/50 mx-2" />

          <ThemeToggle />

          {session ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-primary/5 pl-2 pr-3 h-10 rounded-full border border-transparent hover:border-primary/10 transition-all">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="max-w-[120px] truncate font-medium text-sm">
                    {user?.username || "User"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 glass-card">
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium leading-none">{user?.username || "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleShare} className="rounded-md focus:bg-primary/10 focus:text-primary cursor-pointer">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/sign-up">
                  Get Started
                  <LogIn className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] glass border-l border-white/10 p-0">
              <SheetHeader className="p-6 border-b border-white/5 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                    <Image src="/logo.png" alt="EchoInbox Logo" width={32} height={32} className="object-contain" />
                  </div>
                  <span className="font-display text-xl">Menu</span>
                </SheetTitle>
              </SheetHeader>

              <div className="p-6 flex flex-col gap-6">
                {session ? (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-white/5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/explore"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <Compass className="h-5 w-5" />
                          <span className="font-medium"> Explore</span>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      </SheetClose>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="space-y-3">
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full justify-start gap-3 h-11"
                      >
                        <Share2 className="h-4 w-4" />
                        Share Profile
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <SheetClose asChild>
                      <Link
                        href="/explore"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Compass className="h-5 w-5" />
                        <span className="font-medium">Public Explore</span>
                      </Link>
                    </SheetClose>
                    <div className="grid gap-3">
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full h-11 justify-start px-4">
                          <Link href="/sign-in">
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Link>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button asChild className="w-full h-11 justify-start px-4 shadow-lg shadow-primary/20">
                          <Link href="/sign-up">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create Account
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;