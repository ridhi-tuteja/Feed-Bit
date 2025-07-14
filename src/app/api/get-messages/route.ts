import { getServerSession } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(){
    //console.log("reached here")
    await dbConnect();

     const session=await getServerSession(authOptions)
    const _user:User=session?.user as User  //Assertion

    if(!session || !_user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }
//converted toString in option in auth...findOne, findOneAndUpdate types works but create issue in aggregation pipelines
    const userId=new mongoose.Types.ObjectId(_user._id);
    try {
        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if(!user || user.length===0){
            return Response.json(
            {
                success:false,
                message:"User not found"
            },
            {status:401}
        )
        }
        // return Response.json(
        //     {
        //         success:true,
        //         message:user[0].messages
        //     },
        //     {status:200}
        // )
        return Response.json({
            success: true,
            message: "Messages fetched successfully",
            messages: user[0].messages
            }, { status: 200 });

    } catch (error) {
        console.log("Error in getting mesages ",error);
        return Response.json(
            {
                success:false,
                message:"Error in getting mesages"
            },
            {status:400}
        )
    }
}