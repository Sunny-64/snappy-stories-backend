import mongoose, { Schema } from "mongoose";

// Custom imports
import {roles} from "./../configs";
import Genre from "./genre.model";

const userSchema:Schema = new mongoose.Schema({
    username : {
        type : String, 
        required : true, 
        unique : true,
    }, 
    email : {
        type : String, 
        unique : true, 
        required : true,
    }, 
    password : {
        type : String, 
        required : true, 
    }, 
    isEmailVerified : {
        type : Boolean, 
        default : false,
    },
    role : {
        type : String, 
        enum: Object.values(roles),
        default : roles.user
    },
    // favGenres: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Genre'
    // }],

    status : {
        type : Boolean,
        default : true
    }, 
}, {timestamps : true}); 

export default mongoose.model("User", userSchema);
