import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";
import { toggleAcceptingSchema } from "@/schemas/postSchema";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
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

    const { postId } = await context.params; // AWAIT this!
    const body = await request.json();

    // rest of your code...

    // Validate with Zod
    const result = toggleAcceptingSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { isAcceptingMessages } = result.data;

    // Find the post
    const post = await PostModel.findById(postId);

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Find user to verify ownership
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

    // Check if user owns this post
    if (post.userId.toString() !== (dbUser._id as any).toString()) {
      return Response.json(
        { success: false, message: "Unauthorized to modify this post" },
        { status: 403 }
      );
    }

    // Update the post
    post.isAcceptingMessages = isAcceptingMessages;
    await post.save();

    return Response.json(
      {
        success: true,
        message: `Post is now ${isAcceptingMessages ? 'accepting' : 'not accepting'} messages`,
        isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling messages:", error);
    return Response.json(
      { success: false, message: "Failed to update post settings" },
      { status: 500 }
    );
  }
}