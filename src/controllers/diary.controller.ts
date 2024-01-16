import { Request, Response } from "express"
import {Diary} from './../models'
import { ApiError } from "./../utils";
import { ICustomRequest } from "types";
import mongoose from "mongoose";

export const getAllDiariesOfUser = async (req:ICustomRequest, res:Response) => {
    const userId = req.user._id; 
    const diaries = await Diary.find({userId}).sort({createdAt : -1}); 
    return res.status(200).json({message : "fetched all diaries", data : diaries}); 
} 

export const createNewDiary = async (req:ICustomRequest, res:Response) => {
    const {title, diary} = req.body; 
    if(!(title && diary)) throw new ApiError("Invalid data", 400); 
    const newDiary = new Diary({title, diary, userId : req.user._id}); 
    await newDiary.save(); 
    return res.status(200).json({message : "Diary saved"}); 
}

export const updateDiaryWithId = async (req:ICustomRequest, res:Response) => {
    const {id} = req.params;  
    const {title, diary} = req.body; 

    if(!id) throw new ApiError("Invalid Id", 400); 
    const getDiary = await Diary.findById(id); 
    if(!getDiary) throw new ApiError("Not Found", 404); 
    if(getDiary?.userId !== new mongoose.Types.ObjectId(req?.user?._id)) throw new ApiError("Access Denied", 401); 
    getDiary.title = title ?? getDiary?.title; 
    getDiary.diary = diary ?? getDiary?.diary; 
    await getDiary.save(); 
    return res.status(200).json({message : "Diary Updated"}); 
}

export const deleteDiaryWithId = async (req:ICustomRequest, res:Response) => {
    const {id} = req.params; 
    if(!id) throw new ApiError("Invalid Id", 400); 
    const deleteResult = await Diary.findOneAndDelete({_id : id, userId : req.user._id}); 
    if(!deleteResult) throw new ApiError("Could not Delete", 400); 
    return res.status(200).json({message : "Diary Deleted"}); 
}

export const getDiaryById = async (req:ICustomRequest, res:Response) => {
    const {id} = req.params;  
    if(!id) throw new ApiError("Invalid Id", 400); 
    const getDiary = await Diary.findById(id); 
    if(getDiary?.userId !== new mongoose.Types.ObjectId(req?.user?._id)) throw new ApiError("Access Denied", 401); 
    if(!getDiary) throw new ApiError("Not Found", 404); 
    return res.status(200).json({message : "Diary Found", data : getDiary}); 
}

export const getDiaryByDate = async (req:Request, res:Response) => {
    return res.status(200).json({message : "Diary Found", data : '...'}); 
}