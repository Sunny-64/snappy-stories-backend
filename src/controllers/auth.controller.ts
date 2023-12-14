import { Response, Request } from "express"

// Custom Imports
import { User } from "./../models";
import { AppError } from "./../utils";
import { 
    USER_REGISTERED, 
    USER_ALREADY_REGISTERED, 
 } from "./../constants/response";

export const register = async (req:Request, res:Response) => {
    const {
        username, 
        email, 
        password, 
        favGenres,
    } = req.body; 

    const checkIfUserExist = await User.findOne({username, email});

    if(checkIfUserExist){
        throw new AppError(USER_ALREADY_REGISTERED.message, USER_ALREADY_REGISTERED.status); 
    }

    const newUser = new User({
        username, 
        email, 
        password, 
        favGenres,
    }); 

    await newUser.save(); 
    return res.status(200).json(USER_REGISTERED)
}

