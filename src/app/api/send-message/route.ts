import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user.model";
import { checkBullying } from '@/lib/checkBullying';

const BULLYING_THRESHOLD = 5;

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const bullyingRating = await checkBullying(content);

        if (bullyingRating === null) {
            console.warn("Bullying check could not be performed or returned invalid data. Proceeding cautiously.");
        } else if (bullyingRating > BULLYING_THRESHOLD) {
            console.log(bullyingRating?.toFixed(2))
            return Response.json(
                {
                    success: false,
                    message: "Please avoid inappropriate or disrespectful language."
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error occurred during bullying check:", error);
        return Response.json(
            {
                success: false,
                message: "Error occurred while checking message content. Please try again.",
            },
            { status: 500 }
        );
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // Is user accepting the messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("An unexpected error occurred while sending message: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in sending messages",
            },
            { status: 500 }
        );
    }
}
