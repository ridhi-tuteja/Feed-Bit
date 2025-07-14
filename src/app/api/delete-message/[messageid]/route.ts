// import { getServerSession } from "next-auth";
// import UserModel from "@/model/user.model";
// import { authOptions } from "../../auth/[...nextauth]/option";
// import { User } from "next-auth";
// import { NextRequest } from "next/server";

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { messageid: string } }
// ): Promise<Response> {
//   const { params } = context;
//   const { messageid } = params; 
//      const session=await getServerSession(authOptions)
//     const user:User=session?.user as User  //Assertion

//     if(!session || !session.user){
//         return Response.json(
//             {
//                 success:false,
//                 message:"Not Authenticated"
//             },
//             {status:401}
//         )
//     }

//     try {
//         // const updateResult=await UserModel.updateOne({
//         //    {_id:user._id},
//         //    {$pull:{messages:{_id:messageId}}}
//         // })
//         const updateResult = await UserModel.updateOne(
//       { _id: user._id },
//       { $pull: { messages: { _id: messageid } } }
//     );

//         if(updateResult.modifiedCount==0){
//             return Response.json(
//             {
//                 success:false,
//                 message:"Messages not found or already deleted"
//             },
//             {status:404}
//         )
//         }
//         return Response.json(
//             {
//                 success:true,
//                 message:"Deleted successfully"
//             },
//             {status:200}
//         )
//     } catch (error) {
//         console.log("Error in deleting route: ",error)
//         return Response.json(
//             {
//                 success:false,
//                 message:"Error deleting messages"
//             },
//             {status:500}
//         )
//     }
// }

import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

interface SessionUser extends User {
  _id: string;
}

export async function DELETE(
  req: NextRequest,
  
  { params }: { params: { messageid: string } }
): Promise<Response> {
  const { messageid } = params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const user = session.user as SessionUser;

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete route:", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
