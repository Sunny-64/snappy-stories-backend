import mongoose, { Schema } from "mongoose";

const conversationSchema:Schema = new mongoose.Schema({
    participants : [String],

    status : {
        type : Boolean,
        default : true,
    }
}, {timestamps : true});

export default mongoose.model("Conversation", conversationSchema); 
