import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";

// Get all posts by username (PUBLIC - No auth required)
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  try {
    const { username } = params;

    // Find user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get all posts for this user, sorted by newest first
    // Only return posts that are accepting messages (optional)
    const posts = await PostModel.find({ 
      userId: user._id,
      // Optionally only show posts accepting messages
      // isAcceptingMessages: true 
    })
      .sort({ createdAt: -1 })
      .select('-replies') // Don't send replies in list view
      .lean();

    return Response.json(
      {
        success: true,
        username: user.username,
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return Response.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}