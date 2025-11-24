import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-background/50 backdrop-blur-md py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                            EchoInbox
                        </span>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                            Experience the future of anonymous messaging. Secure, elegant, and designed for the modern web.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <SocialLink href="https://github.com/amankumarjha006" icon={Github} label="GitHub" />
                            <SocialLink href="www.linkedin.com/in/aman-kumar-jha-615274323" icon={Linkedin} label="LinkedIn" />
                            <SocialLink href="mailto:akjha0810@gmail.com" icon={Mail} label="Email" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <FooterLink href="/explore">Explore</FooterLink>
                            <FooterLink href="/dashboard">Dashboard</FooterLink>
                            <FooterLink href="/sign-in">Sign In</FooterLink>
                            <FooterLink href="/sign-up">Get Started</FooterLink>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground">Legal</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                            <FooterLink href="/cookies">Cookie Policy</FooterLink>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} EchoInbox. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                        <span>for the web</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            className="p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
            aria-label={label}
        >
            <Icon className="h-5 w-5" />
        </Link>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="hover:text-primary hover:translate-x-1 transition-all duration-200"
        >
            {children}
        </Link>
    );
}
