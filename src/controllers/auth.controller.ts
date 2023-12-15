import { Response, Request } from "express"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Custom Imports
import { User, Otp } from "./../models";
import { AppError } from "./../utils";
import {
    USER_REGISTERED,
    USER_ALREADY_REGISTERED,
} from "./../constants/response";
import { sendOtp } from "./../services";
import { ICustomRequest } from "types";

export const register = async (req: Request, res: Response) => {
    const {
        username,
        email,
        password,
        favGenres,
    } = req.body;

    const checkIfUserExist = await User.findOne({ username, email });

    if (checkIfUserExist) {
        throw new AppError(USER_ALREADY_REGISTERED.message, USER_ALREADY_REGISTERED.status);
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
    const isOtpSent: boolean = await sendOtp(payload._id as string);
    if (!isOtpSent) return res.status(500).json({ message: "Failed to send Otp but user data is saved" });

    return res.status(200).json({ ...USER_REGISTERED, token, message: "OTP sent" });
}

export const loginUsingEmailAndPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const doesUserExist = await User.findOne({ email: email });
    if (!doesUserExist) throw new AppError("User not Found", 404);
    if (!bcrypt.compareSync(password, doesUserExist.password)) {
        return res.status(400).json({
            success: false,
            message: "Email or password is wrong"
        });
    }
    const payload = doesUserExist.toJSON();
    delete payload.password;
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
    res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        token,
    })
}

export const verifyOtp = async (req: ICustomRequest, res: Response) => {
    const { otp } = req.body;
    const user = req.user;
    if (!otp) throw new AppError("Invalid Otp", 400);
    const fetchOtp = await Otp.findOne({ userId: user._id }).sort({ createdAt: -1 })
    if (!fetchOtp) return res.status(400).json({ message: 'OTP expired' });
    if (fetchOtp.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    // otp matched so find user and mark email verified true
    const fetchUser = await User.findById(user._id);
    if (!fetchUser) return res.status(404).json({ message: 'user not found' });
    fetchUser.isEmailVerified = true;
    res.status(200).json({ message: "Email verified" });
}

export const resendOtp = async (req: ICustomRequest, res: Response) => {
    const otpSent = await sendOtp(req.user._id);
    if (!otpSent) return res.status(500).json({ message: 'failed to send otp' });
    res.status(200).json({ message: 'otp sent' });
}