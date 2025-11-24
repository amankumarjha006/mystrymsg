import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryparam = {
            username: searchParams.get("username")
        }
        // Validate query parameters
        const result = UsernameQuerySchema.safeParse(queryparam);


        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameters",
                },
                { status: 400 }  // ✅ Fixed: moved inside as second argument
            );
        }

        const { username } = result.data;

        const existingUserVerifiedUsername = await UserModel.findOne({ username, isVerified: true })

        if (existingUserVerifiedUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 200 }  // ✅ Fixed
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Username is available",
                },
                { status: 200 }  // ✅ Fixed
            );
        }

    } catch (error) {
        console.error("Error checking username uniqueness:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }  // ✅ Fixed
        );
    }
}