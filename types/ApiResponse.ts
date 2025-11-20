import { Message } from "@/model/User";

export interface Post {
  _id: string;
  username: string;
  content: string;
  isAcceptingMessages: boolean;
  replies: Reply[];
  createdAt: Date;
}

export interface Reply {
  _id: string;
  content: string;
  createdAt: Date;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  posts?: Post[];
  post?: Post;
}