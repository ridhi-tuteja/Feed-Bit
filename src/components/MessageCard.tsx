'use client'

import {
  Card,
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
import { X } from "lucide-react"
import { Message } from "@/model/user.model"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"
import { toast } from "sonner"

type messageCardProps={
    message:Message,
    onMessageDelete:(messageid:string)=>void
}

const MessageCard = ({ message, onMessageDelete }: messageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `api/delete-message/${message._id}`
      );
      toast(response.data.message);

      // ✅ UI sync — remove from state immediately
      onMessageDelete(message._id);
    } catch (error) {
      toast("Failed to delete the message.");
    }
  };

  return (
    <Card className="relative p-4">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message from our system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard