import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string; replyId: string } }
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

    const { postId, replyId } = params;

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
    if (post.userId.toString() !== (dbUser._id as string).toString()) {
      return Response.json(
        { success: false, message: "Unauthorized to delete replies from this post" },
        { status: 403 }
      );
    }

    // Remove the reply
    post.replies = post.replies.filter(
      (reply) => (reply as any)._id.toString() !== replyId
    ) as any;

    await post.save();

    return Response.json(
      {
        success: true,
        message: "Reply deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reply:", error);
    return Response.json(
      { success: false, message: "Failed to delete reply" },
      { status: 500 }
    );
  }
}