'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@react-email/components"
import { X } from "lucide-react"
import { Message } from "@/model/user.model"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"
import { toast } from "sonner"

type messageCardProps={
    message:Message,
    onMessageDelete:(messageid:string)=>void
}

const MessageCard = ({message,onMessageDelete}:messageCardProps) => {
    const handleDeleteConfirm=async()=>{
        const response =await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)
        toast(response.data.message)
    }
  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button><X className='w-5 h-5'/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
        </CardHeader>
</Card>
  )
}

export default MessageCard