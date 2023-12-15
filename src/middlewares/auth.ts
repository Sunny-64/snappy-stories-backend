import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken'; 

// Custom imports
import { ICustomRequest } from 'types';
import { AppError } from './../utils';


export const auth = (req:ICustomRequest, res:Response, next:NextFunction) => {

    const token = req.headers['authorization'] as string;
   
    if (!token) {
        throw new AppError("Unauthorized", 401)
    }
    let tokenValue = token.split(" ")[1]; 
    jwt.verify(tokenValue, process.env.JWT_SECRET_KEY!, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                success : false, 
                message : "Unauthorized"
            })
        } else {
            req.user = decoded as any;
            next();
        }
    });
};