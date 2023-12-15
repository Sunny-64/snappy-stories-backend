import express from "express";

// Custom imports 
import { getAllUsers, getUserWithId } from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth } from "./../../middlewares";
import { requiredRole } from "./../../middlewares";

const router = express.Router(); 

router.use(auth); 
router.get("/", requiredRole('admin'), catchAsync(getAllUsers)); 
router.get("/:id", catchAsync(getUserWithId))

export default router;  