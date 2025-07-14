import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { RequestInternal } from "next-auth";

// interface Credentials {
//   identifier: string;
//   password: string;
// }

interface AuthorizedUser extends User {
  _id: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}
export const authOptions : NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text"},
                password: { label: "Password", type: "password" }
                }, 
                async authorize(
                    credentials: Record<"identifier" | "password", string> | undefined,
                    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
                    ): Promise<AuthorizedUser | null> {
                    if (!credentials) return null;   
                //async authorize(credentials:any):Promise<any> {
                await dbConnect()

                try {
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    });

                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){
                        //return user
                      return {
                        // _id: user._id?.toString(),
                        _id: user._id!.toString(),
                        id: user._id!.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessages
                      };
                    }else{
                        throw new Error("Invalid Password")
                    }
                } catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                token._id=user._id?.toString()
                token.isVerified=user.isVerified
                token.isAcceptingMessages=user.isAcceptingMessages
                token.username=user.username
            }
            return token
        },
        async session({ session,token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
        },    
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy :"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}
