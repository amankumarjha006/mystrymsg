import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";



const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "EchoInbox - Anonymous Feedback",
  description: "Collect anonymous feedback and questions from your audience.",
  icons: {
    icon: [
      { url: "/web/icons8-chat-comic-16.png", sizes: "16x16", type: "image/png" },
      { url: "/web/icons8-chat-comic-32.png", sizes: "32x32", type: "image/png" },
      { url: "/web/icons8-chat-comic-96.png", sizes: "96x96", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={`${inter.variable} ${dmSerifDisplay.variable} font-body bg-background text-foreground antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
