import { NextFunction, Response, Request } from "express";

// custom imports
import { AppError } from "./../utils";

const errorHandler = (error:Error | AppError, req:Request, res:Response, next:NextFunction) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            message : error.message,
            status : error.statusCode, 
        });
    }
    return res.status(500).json({error : error?.message})
}

export default errorHandler; 