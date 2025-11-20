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
    
    console.log('=== POST DETAILS API DEBUG ===');
    console.log('PostId received:', postId);
    console.log('PostId type:', typeof postId);

    // Find the post with all replies
    const post = await PostModel.findById(postId).lean();

    if (!post) {
      console.log('Post not found in database');
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