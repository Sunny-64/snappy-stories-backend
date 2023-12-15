import mongoose from "mongoose";
import bcrypt from 'bcrypt'; 

// Custom Imports
import { User } from "../models";
import { roles } from "../configs";

export const seed = async () => {
   try{
        const doesAdminExist = await User.findOne({role : 'admin'}); 
        if(doesAdminExist){
            return; 
        }
        const admin = new User({
            username : 'admin', 
            email : 'admin@gmail.com', 
            password : bcrypt.hashSync('1234', 10), 
            role : roles.admin, 
            isEmailVerified : true,
        }); 

        await admin.save();
        console.log("Admin Seeded");
   }
   catch(err){
        console.log(err); 
   }
}
