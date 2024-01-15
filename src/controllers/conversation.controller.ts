import { Response } from "express"
import mongoose from "mongoose";

// Custom Imports
import { Conversation, Message } from "./../models"
import { ICustomRequest } from "./../types";
import { ApiError } from "./../utils";
import { emitSocketEvent } from "./../sockets";
import chatEvents from "./../constants/chatEvents";
import { commonChatAggregation } from "./../aggregations";

export const createOrGetConversation = async (req: ICustomRequest, res: Response) => {
    const { targetId } = req.params;
    const userId = req.user._id;

    // make a check for targetId I'll skip it for now.
    if (!targetId) throw new ApiError("User does not Exist", 400);
    const doesConversationAlreadyExists = await Conversation.aggregate([
        {
            $match: {
                participants: {
                    $all: [
                        new mongoose.Types.ObjectId(req?.user?._id), 
                        new mongoose.Types.ObjectId(targetId) 
                    ]
                }
            }
        },
        ...commonChatAggregation
    ]);

    // if it doesn't exist create a new conversation
    if (!doesConversationAlreadyExists || !doesConversationAlreadyExists.length) {
        const conversationObj = {
            participants: [userId, new mongoose.Types.ObjectId(targetId)],
        };
        const newConversation = new Conversation(conversationObj);
        const savedData = await newConversation.save();
        const payload = await Conversation.findOne({_id : savedData._id}).populate({
            path: "participants",
            select: "-password" // Exclude the "password" field
        });
        // replace the any with user Object
        payload?.participants.forEach((participant: any) => {
            if (participant?._id?.toString() === req?.user?._id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
            // emit event to other participants with new chat as a payload
            emitSocketEvent(
                req,
                participant?._id?.toString(),
                chatEvents.NEW_CONVERSATION,
                payload
            );
        });
        return res.status(200).json({ message: "Conversation created", data: payload });
    }
    return res.status(200).json({ message: "Conversations fetched", data: doesConversationAlreadyExists });
}

export const fetchConversationsOfUser = async (req: ICustomRequest, res: Response) => {
    const conversations = await Conversation.aggregate([
        {
            $match: {
                participants: {
                    $in: [
                        new mongoose.Types.ObjectId(req?.user?._id)
                    ]
                }
            }
        },
        ...commonChatAggregation, 
        {
            $sort: {
              updatedAt: -1, // Sort by 'createdAt' field in descending order
              createdAt : -1,
            }
          }
    ]);
    res.status(200).json({ message: "fetched conversations", data: conversations });
}
