import { Response, Request } from "express"

// Custom Imports
import {
    GET_ALL_USERS,
} from "./../constants/response";

import { User } from "./../models";
import { ICustomRequest } from "./../types";
import { ApiError } from "./../utils";

export const getAllUsers = async (req: ICustomRequest, res: Response) => {
    const fetchUsers = await User.find(
        {
            _id: { $ne: req.user._id },
            role: { $ne: 'admin' } // Exclude users with 'admin' role
        },
        { password: 0 } // exclude password
    );

    return res.status(200)
        .json({
            ...GET_ALL_USERS,
            data: fetchUsers
        })
}

export const getUserWithId = async (req: Request, res: Response) => {
    const fetchUser = await User.findById(req.params.id);
    if (!fetchUser) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    return res.status(200).json({
        message: "fetched Users",
        data: fetchUser
    })
}

export const getUserWithToken = async (req: ICustomRequest, res: Response) => {
    const userId: any = req.user._id;
    const getUser = await User.findById(userId).select({ password: -1 });

    if (!getUser) throw new ApiError("User not found", 404);
    return res.status(200).json({ message: "User fetched", data: getUser });
}