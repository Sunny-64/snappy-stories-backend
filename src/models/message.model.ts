import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Conversation'
    },
    message : {
        type : String, 
    }, 
    author : {
        type : String,
    }
}, {timestamps : true})

export default mongoose.model("Message", messageSchema); 
