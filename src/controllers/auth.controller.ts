import { Response, Request } from "express"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Custom Imports
import { User, Otp } from "./../models";
import { ApiError } from "./../utils";
import {
    USER_REGISTERED,
    USER_ALREADY_REGISTERED,
    USER_NOT_FOUND,
} from "./../constants/response";
import { sendOtp } from "./../services";
import { ICustomRequest, IResponseObject } from "./../types";
import { otpTypes } from "./../configs";


/**
 * @description Registers the User.
 * @param username 
 * @param email 
 * @param password 
 * @param favGenres 
 * @returns 
 */

// multer middleware for profile pictures and favGenres and joi validations 
export const register = async (req: Request, res: Response) => {
    const {
        username,
        email,
        password,
        favGenres,
    } = req.body;

    const checkIfUserExist = await User.findOne({ username, email });

    if (checkIfUserExist) {
        throw new ApiError(USER_ALREADY_REGISTERED.message, USER_ALREADY_REGISTERED.status);
    }

    const newUser = new User({
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        favGenres,
    });

    const saveUser = await newUser.save();

    // Generate token
    const payload = saveUser.toJSON();
    delete payload.password;
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
    const isOtpSent: boolean = await sendOtp(payload._id as string, otpTypes.VERIFY_EMAIL);
    if (!isOtpSent) return res.status(500).json({ message: "Failed to send Otp but user data is saved" });

    return res.status(200).json({ ...USER_REGISTERED, token, message: "OTP sent", otpType : otpTypes.VERIFY_EMAIL});
}

/**
 * @description checks if the email entered is valid and authenticates the user 
 * @param email 
 * @param password 
 * @returns token
 */

export const loginUsingEmailAndPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const doesUserExist = await User.findOne({ email: email });
    if (!doesUserExist) throw new ApiError("User not Found", 404);
    if (!bcrypt.compareSync(password, doesUserExist.password)) throw new ApiError("wrong email or Password", 400); 
    const payload = doesUserExist.toJSON();
    delete payload.password;
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
    const responseJson:IResponseObject = {
        message: "Logged in Successfully",
        token,
    }
    if(!doesUserExist.isEmailVerified){
        sendOtp(doesUserExist._id as string, otpTypes.VERIFY_EMAIL); 
        responseJson.message = "Please verify the email, otp sent"; 
        responseJson.otpType = otpTypes.VERIFY_EMAIL
    }
    res.status(200).json(responseJson)
}

/**
 * @description verifies the otp entered by the user and marks the email as verified email permanently.
 * @param Otp 
 * @tokenRequired 
 */

export const verifyEmail = async (req: ICustomRequest, res: Response) => {
    const { otp } = req.body;
    console.log(otp, "otp..........");
    const user = req.user;
    if (!otp) throw new ApiError("Invalid Otp", 400);
    const fetchOtp = await Otp.findOne({ userId: user._id }).sort({ createdAt: -1 })
    if (!fetchOtp || fetchOtp.isVerified) throw new ApiError("OTP expired", 400); 
    if (fetchOtp.otp !== otp || fetchOtp.otpType !== otpTypes.VERIFY_EMAIL) throw new ApiError("Invalid OTP in db", 400); 
    
    // otp matched so find user and mark email verified true
    const fetchUser = await User.findById(user._id);
    if (!fetchUser) throw new ApiError("User not found", 404); 
    fetchUser.isEmailVerified = true;
    fetchOtp.isVerified = true; 
    await fetchOtp.save(); 
    await fetchUser.save(); 
    res.status(200).json({ message: "Email verified" });
}

/**
 * @description sends the otp
 * @tokenRequired 
 * @param otpType
 */

export const resendOtp = async (req: ICustomRequest, res: Response) => {
    const {otpType} = req.body; 
    // console.log("OTP type >>>>>>> ",otpType); 
    if(otpTypes.VERIFY_EMAIL !== otpType) throw new ApiError("Invalid Otp", 400); 
    const otpSent = await sendOtp(req.user._id, otpType);
    if (!otpSent) return res.status(500).json({ message: 'failed to send otp' });
    res.status(200).json({ message: 'OTP sent' });
}

/**
 * @description verifies the email entered by the user is correct and sends an OTP to that email.
 * @param email
 * @returns user id
 */
export const forgotPassword = async (req:ICustomRequest, res:Response) => {
    const {email} = req.body; 
    const doesUserExist = await User.findOne({email}); 
    if(!doesUserExist) throw new ApiError("User not Found", 404); 
    sendOtp(doesUserExist._id as string, otpTypes.RESET_PASSWORD); 
    res.status(200).json({message : "OTP sent", otpType : otpTypes.RESET_PASSWORD, data : doesUserExist._id}); 
}

/**
 * @description : Verifies Otp by checking if a user is valid and confirms the otp verification success
 * @param Otp 
 */
export const verifyOtp = async (req:Request, res:Response) => {
    const {otp} = req.body; 
    const {userId} = req.params; 
    const checkUser = await User.findById(userId);     
    if(!checkUser) throw new ApiError("User not Found", 404); 
    const checkOtp = await Otp.findOne({userId}).sort({createdAt : -1}); 
    if(!checkOtp || checkOtp.isVerified) return res.status(400).json({message : "Otp expired"}); 
    if(checkOtp.otpType !== otpTypes.RESET_PASSWORD ||otp !== checkOtp.otp) throw new ApiError("OTP did not match", 400); 
    checkOtp.isVerified = true; 
    await checkOtp.save(); 
    res.status(200).json({message : "Otp verified successfully"}); 
}

/**
 * @description : Verifies the user and updates the password
 * @param newPassword 
*/

export const resetPassword = async (req:Request, res:Response) => {
    const {newPassword} = req.body; 
    const {userId} = req.params; 
    const checkOtpVerified = await Otp.findOne({userId, isVerified : true, otpType : otpTypes.RESET_PASSWORD}).sort({createdAt : -1}); 
    // if otp is removed from the db which it get's deleted automatically after 6 minutes the entire process will need to happen again.
    if(!checkOtpVerified) return res.status(400).json({message : "Please Verify the Otp first"}); 
    const checkUser = await User.findById(userId); 
    if(!checkUser) throw new ApiError("User not found", 404); 
    checkUser.password = bcrypt.hashSync(newPassword, 10);
    await checkUser.save(); 
    res.status(200).json({message : "Password Reset successfully"}); 
}

