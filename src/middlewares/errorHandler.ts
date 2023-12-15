import { NextFunction, Response, Request } from "express";

// custom imports
import { ApiError } from "./../utils";

const errorHandler = (error:Error | ApiError, req:Request, res:Response, next:NextFunction) => {
    if(error instanceof ApiError){
        return res.status(error.statusCode).json({
            message : error.message,
            status : error.statusCode, 
        });
    }
    return res.status(500).json({error : error?.message})
}

export default errorHandler; 