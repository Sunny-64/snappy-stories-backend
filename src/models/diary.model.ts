import mongoose, { Schema } from "mongoose";

const diarySchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User'
    },
    title : {
        type : String, 
        default : 'Untitled', 
    }, 
    diary : {
        type : String, 
    }, 
    attachments : [], // string of image urls..
    status : {
        type : Boolean,  
        default : true, 
    }
}, {timestamps : true})

export default mongoose.model("Diary", diarySchema); 
