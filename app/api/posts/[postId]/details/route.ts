import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";

// Get single post with all details (PUBLIC - for reply page)
export async function GET(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  await dbConnect();

  try {
    // AWAIT the params!
    const { postId } = await context.params;

    // Find the post with all replies
    const post = await PostModel.findById(postId).lean();

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}