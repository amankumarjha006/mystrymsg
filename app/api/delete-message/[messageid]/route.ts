import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, {params}:{params: {messageid: string}}) {
    const messageId = params.messageid
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
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            {$pull: {messages:{_id:messageId}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json(
            {
                success: false,
                message: "Messaage not found or already deleted",
            }
        ), { status: 404 };
        } 
    } catch (error) {
        console.log("Error in delete message route", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            }
        ), { status: 500 };
    }

}