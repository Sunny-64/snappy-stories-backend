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

export const getUserWithId = async (req:Request, res:Response) => {
    const fetchUser = await User.findById(req.params.id); 
    if(!fetchUser) {
        res.status(404).json({
            message : 'User not found'
        }); 
    }
    res.status(200).json({
        message : "fetched Users", 
        data : fetchUser
    })
}