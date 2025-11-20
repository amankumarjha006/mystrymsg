import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import { replySchema } from "@/schemas/postSchema";

// Send anonymous reply to a post (PUBLIC - No auth required)
export async function POST(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  await dbConnect();

  try {
    const { postId } = await context.params; // AWAIT this!
    const body = await request.json();

    // rest of your code...

    // Validate with Zod
    const result = replySchema.safeParse(body);
    if (!result.success) {
      const contentErrors = result.error.format().content?._errors || [];
      return Response.json(
        {
          success: false,
          message: contentErrors.length > 0 
            ? contentErrors[0] 
            : "Invalid reply content",
        },
        { status: 400 }
      );
    }

    const { content } = result.data;

    // Find the post
    const post = await PostModel.findById(postId);

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Check if post is accepting messages
    if (!post.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "This post is not accepting replies" },
        { status: 403 }
      );
    }

    // Add the anonymous reply
    post.replies.push({
      content,
      createdAt: new Date(),
    } as any);

    await post.save();

    return Response.json(
      {
        success: true,
        message: "Reply sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending reply:", error);
    return Response.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 }
    );
  }
}