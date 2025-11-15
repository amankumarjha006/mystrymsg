import mongoose, { Schema, Document } from "mongoose";

export interface Reply extends Document {
  content: string;
  createdAt: Date;
}

const ReplySchema: Schema<Reply> = new Schema({
  content: { 
    type: String, 
    required: true,
    maxlength: [300, "Reply cannot exceed 300 characters"]
  },
  createdAt: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

export interface Post extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  username: string; // Denormalized for easier queries
  content: string;
  isAcceptingMessages: boolean;
  replies: Reply[];
  createdAt: Date;
}

const PostSchema: Schema<Post> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: [true, "Post content is required"],
    trim: true,
    maxlength: [500, "Post cannot exceed 500 characters"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  replies: {
    type: [ReplySchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ username: 1, createdAt: -1 });

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", PostSchema);

export default PostModel;