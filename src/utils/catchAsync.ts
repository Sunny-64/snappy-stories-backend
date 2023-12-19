import { Request, Response, NextFunction, RequestHandler } from "express"
export const catchAsync = (controller:RequestHandler) => async (req:Request, res:Response, next:NextFunction) => {
    try{
        await controller(req, res, next); 
    }
    catch(err){
        console.log(err); 
        next(err);
    }
}