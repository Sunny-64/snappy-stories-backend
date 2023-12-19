import { Request, Response } from "express"

// Custom imports
import { Message, Conversation } from "./../models"
import { ApiError } from "./../utils";
import { ICustomRequest } from "./../types";
import { emitSocketEvent } from "./../sockets";
import chatEvents from "./../constants/chatEvents";

export const getAllMessagesOfAConversation = async (req:Request, res:Response) => {
    const {conversationId} = req.params; 
    const doesConversationExist = await Conversation.findById(conversationId); 
    if(!doesConversationExist) throw new ApiError("Conversation does not exist", 400); 
    const messages = await Message.find({conversationId}).populate("conversationId").sort({createdAt : -1}); 
    res.status(200).json({message : "fetched all messages", data : messages});
}

export const sendMessage = async (req:ICustomRequest, res:Response) => {
    const {conversationId} = req.params; 
    const {message} = req.body; 
    const user = req.user; 
    
    const doesConversationExist = await Conversation.findById(conversationId); 
    if(!doesConversationExist) throw new ApiError("Conversation does not exist", 400); 

    const messageObj = {
        conversationId, 
        message, 
        author : user._id, 
    }

    const newMessage = new Message(messageObj); 
    const savedMessage = await newMessage.save(); 

    doesConversationExist.participants.forEach((participant: any) => {
        if (participant?._id?.toString() === req?.user?._id?.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
        // emit event to other participants with new chat as a payload
        emitSocketEvent(
            req,
            participant?._id?.toString(),
            chatEvents.NEW_MESSAGE,
            savedMessage?.message
        );
    });

    res.status(200).json({message : "Message Sent Succcessfully"});
}