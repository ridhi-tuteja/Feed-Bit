import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user.model";

export async function POST(request:Request){
    await dbConnect()

    const {username,content}=await request.json()
    try {
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json(
            {
                sucess:false,
                message:"User not found"
            },
            {status:401}
        )
        }

        //is user accepting the messages
        if(!user.isAcceptingMessages){
            return Response.json(
            {
                sucess:false,
                message:"User is not accepting messages"
            },
            {status:401}
        )
        }

        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                sucess:true,
                message:"Message sent successfully"
            },
            {status:201}
        )
        
    } catch (error) {
        console.log("An unexpected error occured: ",error );
        return Response.json(
            {
                success:false,
                message:"Error in sending mesages"
            },
            {status:400}
        )
    }
}

