import { Request, Response, NextFunction, RequestHandler } from "express"
import { ICustomRequest } from "./../types";
export const catchAsync = (controller:RequestHandler) => async (req:Request | ICustomRequest, res:Response, next:NextFunction) => {
    try{
        await controller(req, res, next); 
    }
    catch(err){
        console.log(err); 
        next(err);
    }
}