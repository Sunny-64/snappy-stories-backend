import express from "express";

// Custom imports 
import { getAllUsers } from "./../../controllers";
import { catchAsync } from "./../../utils";

const router = express.Router(); 

router.get("/", catchAsync(getAllUsers)); 


export default router; 