import { Response } from "express"
import { Conversation, Message } from "./../models"
import { ICustomRequest } from "./../types";
import { ApiError } from "./../utils";

// export const sendMessage = async (req: ICustomRequest, res: Response) => {
//     const { userId } = req.params;
//     const { message } = req.body;
//     const currentUser = req.user._id;

//     // check if id is valid
//     let existingConversation = await Conversation.findOne({
//         participants: {
//             $elemMatch: { $in: [currentUser, userId] },
//             $size: 2, 
//         },
//     });
//     if(!existingConversation){
//         const newConversation = new Conversation({
//             participants : [currentUser, userId]
//         }); 
//         existingConversation = await newConversation.save(); 
//     }
//     // save the message
//     const newMessage = new Message({
//         conversationId : existingConversation._id, 
//         message : message, 
//         author : currentUser,
//     }); 

//     await newMessage.save(); 
//     res.status(200).json({message : "Message Saved"}); 
// }                                                                         

export const createNewConversation = async (req: ICustomRequest, res: Response) => {
    const { targetId } = req.body;
    const userId = req.user._id;
    // make a check for targetId I'll skip it for now.

    const doesConversationAlreadyExists = await Conversation.find({
        $elemMatch: { $in: [userId, targetId] },
        $size: 2,
    }); 

    if(!doesConversationAlreadyExists) throw new ApiError("Conversation Already Exist", 400); 
    const conversationObj = {
        participants : [userId, targetId], 
    }; 
    const newConversation = new Conversation(conversationObj); 
    await newConversation.save(); 
    res.status(200).json({message : "Conversation created"}); 
}

export const fetchConversationsOfUser = async (req:ICustomRequest, res:Response) => {
    const conversations = await Conversation.find({
        participants: { $in: [req.user._id] },
    });

    res.status(200).json({message : "fetched conversations", data : conversations}); 
}