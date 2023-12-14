import mongoose, { Model, Schema, mongo } from "mongoose";

const genreSchema:Schema = new mongoose.Schema({
    genre : {
        type : String, 
        required : true
    }, 
    description : {
        type : String,
        required : true,
    }, 
    status : {
        type : Boolean, 
        default : true,
    }
}, {timestamps : true}); 


export default mongoose.model("Genre", genreSchema); 