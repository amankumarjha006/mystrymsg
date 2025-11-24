import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            }
        ), { status: 401 };
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                }
            ), { status: 404 };
        }
        else {
            return Response.json(
                {
                    success: true,
                    message: "Message preferences updated successfully",
                    updatedUser,
                }
            ), { status: 200 };
        }
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "Failed to update message preferences",
            }
        ), { status: 500 };
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            }
        ), { status: 401 };
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                }
            ), { status: 404 };
        }
        else {
            return Response.json(
                {
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessages,
                }
            ), { status: 200 };
        }
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "Failed to fetch message preferences",
            }
        ), { status: 500 };
    }

}