import { Response, Request } from "express"

// Custom Imports
import { 
    GET_ALL_USERS,
 } from "./../constants/response";

 import { User } from "./../models";

export const getAllUsers = async (req:Request, res:Response) => {
    const fetchUsers = await User.find(); 
    return res.status(200)
    .json({
        ...GET_ALL_USERS, 
        data : fetchUsers
    })
}