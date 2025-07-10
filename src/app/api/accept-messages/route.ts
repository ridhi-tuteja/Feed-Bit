import { getServerSession } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User  //Assertion

    if(!session || !session.user){
        return Response.json(
            {
                sucess:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }

    const userId=user._id;
    const {acceptMessages}=await request.json();

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return Response.json(
            {
                sucess:false,
                message:"Failed to update user status to accept messages"
            },
            {status:401}
        )
        }
        return Response.json(
            {
                sucess:true,
                message:"Message accceptance updated successsfully",
                updatedUser
            },
            {status:200}
        )

    } catch (error) {
        console.log("Error in getting message acceptance status")
        return Response.json(
            {
                sucess:false,
                message:"Error in getting message acceptance status"
            },
            {status:500}
        )
    }
}

export async function GET(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions)
    try {
        const user:User=session?.user as User  //Assertion
    
        if(!session || !session.user){
            return Response.json(
                {
                    sucess:false,
                    message:"Not Authenticated"
                },
                {status:401}
            )
        }
    
        const userId=user._id;
        const foundUser=await UserModel.findById(userId);
    
        if(!foundUser){
            return Response.json(
                {
                    sucess:false,
                    message:"User not found"
                },
                {status:404}
        )
        }
        return Response.json(
            {
                sucess:true,
                isAcceptingMessages:foundUser.isAcceptingMessages
            },
            {status:201}
        )
    } catch (error) {
        console.log("Failed to find user")
        return Response.json(
            {
                sucess:false,
                message:"Failed to find user"
            },
            {status:500}
        )
    }
}