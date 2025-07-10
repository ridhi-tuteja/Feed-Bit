import { getServerSession } from "next-auth";
import UserModel from "@/model/user.model";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageId=params.messageid
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

    try {
        // const updateResult=await UserModel.updateOne({
        //    {_id:user._id},
        //    {$pull:{messages:{_id:messageId}}}
        // })
        const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

        if(updateResult.modifiedCount==0){
            return Response.json(
            {
                sucess:false,
                message:"Messages not found or already deleted"
            },
            {status:404}
        )
        }
        return Response.json(
            {
                sucess:true,
                message:"Deleted successfully"
            },
            {status:200}
        )
    } catch (error) {
        console.log("Error in deleting route: ",error)
        return Response.json(
            {
                sucess:false,
                message:"Error deleting messages"
            },
            {status:500}
        )
    }
}