# EchoInbox 🎭

**EchoInbox** is a modern, anonymous messaging platform built with Next.js 16. Share your thoughts, receive honest feedback, and engage with your community—all while maintaining complete anonymity.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat-square&logo=mongodb)

## ✨ Features

- 🔐 **Secure Authentication** - NextAuth.js with email verification
- 💬 **Anonymous Messaging** - Send and receive messages completely anonymously
- 📝 **Post Creation** - Share thoughts and receive anonymous replies
- 🤖 **AI-Powered Suggestions** - Get smart reply suggestions powered by AI
- 🎨 **Beautiful UI** - Modern design with dark/light theme support
- 📱 **Fully Responsive** - Optimized for all devices
- 🚀 **Real-time Updates** - Smooth animations with Framer Motion
- 🔒 **Rate Limiting** - Built-in protection against spam and abuse
- 🛡️ **XSS Protection** - Input sanitization for security

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Email:** [Resend](https://resend.com/)
- **AI:** [OpenRouter](https://openrouter.ai/)
- **Rate Limiting:** [Upstash](https://upstash.com/)
- **Validation:** [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Upstash Redis](https://upstash.com/) account (for rate limiting)
- [Resend](https://resend.com/) account (for emails)
- [OpenRouter](https://openrouter.ai/) API key (for AI suggestions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/echoinbox.git
   cd echoinbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echoinbox
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # OpenRouter AI API
   OPENROUTER_API_KEY=your-openrouter-api-key
   
   # Resend Email Service
   RESEND_API_KEY=your-resend-api-key
   
   # Upstash Redis (for rate limiting)
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   
   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   
   **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
echoinbox/
├── app/                    # Next.js app directory
│   ├── (app)/             # Protected routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── explore/       # Public feed
│   │   └── u/             # User profiles
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Navbar.tsx        # Navigation bar
│   └── Footer.tsx        # Footer component
├── lib/                   # Utility functions
│   ├── dbConnect.ts      # MongoDB connection
│   └── ratelimit.ts      # Rate limiting config
├── model/                 # Mongoose models
├── schemas/               # Zod validation schemas
└── types/                 # TypeScript type definitions
```

## 🔒 Security Features

- **Rate Limiting**: Prevents spam and abuse
  - Messages: 10 per 10 seconds
  - Posts: 5 per 10 seconds
  - AI Suggestions: 20 per 10 seconds
- **Input Sanitization**: DOMPurify prevents XSS attacks
- **Authentication**: Secure session management with NextAuth
- **Environment Variables**: Sensitive data kept secure

## 🎨 Features in Detail

### Anonymous Messaging
Users can create posts and receive anonymous replies from anyone with the link to their profile.

### AI-Powered Suggestions
Get intelligent reply suggestions powered by AI that adapt to the conversation context.

### User Dashboard
Manage your posts, toggle reply acceptance, and view all your anonymous messages in one place.

### Public Explore
Discover posts from the community and engage anonymously.

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy EchoInbox is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- Update `NEXTAUTH_URL` to your production domain
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure all API keys are set correctly

## 📝 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or feedback, reach out at [akjha0810@gmail.com](mailto:akjha0810@gmail.com)

---

Made with ❤️ for the web
