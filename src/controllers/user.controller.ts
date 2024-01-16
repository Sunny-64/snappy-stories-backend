import { Response, Request } from "express"

// Custom Imports
import {
    GET_ALL_USERS,
} from "./../constants/response";

import { User } from "./../models";
import { ICustomRequest } from "./../types";
import { ApiError } from "./../utils";
import { sendOtp } from "./../services";
import { otpTypes } from "./../configs";
import bcrypt from 'bcrypt'
import { validateEmail } from "./../validations";
import { defaultAvatars, defaultAvatarKeys } from "./../constants/avatar";

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
    const userId:string = req.user._id;
    const getUser = await User.findById(userId, {password : 0});

    if (!getUser) throw new ApiError("User not found", 404);
    return res.status(200).json({ message: "User fetched", data: getUser });
}

// username, password, (avatar) 
export const updateUserDetails = async (req: ICustomRequest, res: Response) => {
    const userId:string = req.user._id; 
    const {username, oldPassword, newPassword} = req.body; 
    const getUser = await User.findById(userId);
    if (!getUser) throw new ApiError("User not found", 404);

    if(username){
        // validate username - pending...
        getUser.username = username; 
    }

    if(oldPassword && newPassword) {
        // validate password 
        // update password...
        if(!bcrypt.compareSync(oldPassword, getUser?.password)) throw new ApiError("Wrong Password", 400); 
        if(oldPassword?.toLowerCase() === newPassword?.toLowerCase()) throw new ApiError("New Password can not be same as the old one", 400); 
        getUser.password = bcrypt.hashSync(newPassword, 10); 
    }
    await getUser.save(); 
    return res.status(200).json({message : "Information Updated"}); 
}

export const updateEmail = async (req: ICustomRequest, res: Response) => {
    const {newEmail, password} = req.body; 
    const userId = req.user._id; 

    const getUser = await User.findById(userId);
    if(!getUser) throw new ApiError("User not found", 404); 
    if(!bcrypt.compareSync(password, getUser?.password)) throw new ApiError("Wrong Password", 400); 

    // validate email
    const isValidEmail = validateEmail(newEmail)
    if(!isValidEmail) throw new ApiError("Invalid email", 400); 

    getUser.email = newEmail; 
    getUser.isEmailVerified = false; 
    await getUser.save(); 
    const isOtpSent = await sendOtp(getUser._id as string, otpTypes.VERIFY_EMAIL); 
    if(!isOtpSent) return res.status(500).json({message : "Failed to send email please try again"}); 
    return res.status(200).json({message : 'OTP sent Please verify your email'}); 
}

export const setOrUpdateAvatar = async (req: ICustomRequest, res: Response) => {
    const userId = req.user._id; 
    const {avatar} : {avatar : string} = req.body; 
    const getUser = await User.findById(userId);
    if(!getUser) throw new ApiError("User not found", 404); 

    // if there's no image provided but user has selected a default avatar.
    if(avatar && !defaultAvatarKeys.includes(avatar)) throw new ApiError("Invalid Avatar Name", 400); 

    if((!req?.file && !req?.file?.filename) && avatar) {
        getUser.avatar = defaultAvatars[avatar]; 
    }
    
    // if user hasn't provided any avatar and didn't select any default one.
    else if((!req?.file && !req?.file?.filename) && !avatar) {
        const randomNumber = Math.floor(Math.random() * 5 + 1); 
        const selectRandomAvatar = defaultAvatarKeys[randomNumber]; 
        getUser.avatar = defaultAvatars[selectRandomAvatar]; 
    }
    // if user has selected an avatar.
    else {
        console.log("executed...")
        getUser.avatar = req?.file?.filename; 
    }

    await getUser.save(); 
    res.status(200).json({message : 'Avatar set successfully'}); 
}