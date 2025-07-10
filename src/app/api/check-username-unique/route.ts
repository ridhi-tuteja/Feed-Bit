import dbConnect from "@/lib/dbConnect";
import {z} from 'zod';
import UserModel from "@/model/user.model";
import {usernameValidation} from '@/schemas/signUpSchema';

const usernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request){
//console.log(request.method)
    if(request.method!=='GET'){
        return Response.json(
            { 
                success:false,
                message:"Method not allowed",
            },
            {
                status:405
            }
        )
    }

    await dbConnect();

    try {
        const {searchParams}=new URL(request.url);
        const queryParam={
            username:searchParams.get('username')
        }
        //validate zod
        const result=usernameQuerySchema.safeParse(queryParam);
        //console.log(result)
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            return Response.json(
                { 
                    success:false,
                    message:usernameErrors?.length>0?usernameErrors.join(', '):"Invalid query parameter",
                },
                {
                    status:400
                }
            )
        }
        const {username}=result.data;

        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json(
                { 
                    success:false,
                    message:"Username is already taken",
                },
                {
                    status:400
                }
            )
        }
        return Response.json(
            { 
                success:true,
                message:"Username is unique",
            },
            {
                status:200
            }
        )

    } catch (error) {
       console.log("Eror checking userrname ",error);
       return Response.json(
        {
            success:false,
            message:"error checking username"
        },
        { status:500 } 
       ) 
    }
}