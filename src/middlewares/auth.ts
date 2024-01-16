import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

// Custom imports
import { ICustomRequest } from 'types';
import { ApiError } from './../utils';


export const auth = (req: ICustomRequest, res: Response, next: NextFunction) => {

    const token = req.headers['authorization'] as string;

    if (!token) {
        throw new ApiError("Unauthorized", 401)
    }
    let tokenValue = token.split(" ")[1];
    jwt.verify(tokenValue, process.env.JWT_SECRET_KEY!, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        } else {
            req.user = decoded as any;
            next();
        }
    });
};

export const verifiedEmailRequired = (req: ICustomRequest, res: Response, next: NextFunction) => {
    if(!req.user.isEmailVerified) throw new ApiError("Unauthorized Please verify the email first", 401); 
    next(); 
}