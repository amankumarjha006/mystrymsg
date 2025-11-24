import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { messageRatelimit, checkRateLimit } from "@/lib/ratelimit";
import DOMPurify from "isomorphic-dompurify";

export async function POST(request: Request) {
    await dbConnect();

    // Rate limiting check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
    const { success: rateLimitSuccess } = await checkRateLimit(messageRatelimit, ip);

    if (!rateLimitSuccess) {
        return Response.json(
            {
                success: false,
                message: "Too many requests. Please try again later.",
            },
            { status: 429 }
        );
    }

    const { username, content } = await request.json()

    // Sanitize content to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });

    if (!sanitizedContent || sanitizedContent.trim().length === 0) {
        return Response.json(
            {
                success: false,
                message: "Message content cannot be empty",
            },
            { status: 400 }
        );
    }

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );

        } else if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }

        const newMessage = { content: sanitizedContent, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );

    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "Error adding messages",
            },
            { status: 500 }
        );
    }
}