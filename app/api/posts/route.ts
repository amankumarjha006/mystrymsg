import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";
import { createPostSchema } from "@/schemas/postSchema";

// Create a new post
export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate with Zod
    const result = createPostSchema.safeParse(body);
    if (!result.success) {
      const contentErrors = result.error.format().content?._errors || [];
      return Response.json(
        {
          success: false,
          message: contentErrors.length > 0 
            ? contentErrors[0] 
            : "Invalid post content",
        },
        { status: 400 }
      );
    }

    const { content } = result.data;

    // Find user from database
    const dbUser = await UserModel.findOne({ 
      $or: [
        { email: user.email },
        { username: user.username }
      ]
    });

    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Create new post
    const newPost = await PostModel.create({
      userId: dbUser._id,
      username: dbUser.username,
      content,
      isAcceptingMessages: true,
      replies: [],
    });

    return Response.json(
      {
        success: true,
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}

// Get all posts for logged-in user (for dashboard)
export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const dbUser = await UserModel.findOne({ 
      $or: [
        { email: user.email },
        { username: user.username }
      ]
    });

    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get all posts for this user, sorted by newest first
    const posts = await PostModel.find({ userId: dbUser._id })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(
      {
        success: true,
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}