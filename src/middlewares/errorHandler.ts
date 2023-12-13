import { NextFunction, Response, Request } from "express";

// custom imports
import { AppError } from "./../utils";

const errorHandler = (error:Error, req:Request, res:Response, next:NextFunction) => {
    if(error instanceof AppError){
        res.status(error.statusCode).json({
            message : error.message
        });
    }
    return res.status(400).json({error : error?.message})
}

export default errorHandler; 