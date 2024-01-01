import express from "express";

// Custom imports 
import { getAllUsers, getUserWithId, getUserWithToken } from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth } from "./../../middlewares";
import { requiredRole } from "./../../middlewares";

const router = express.Router(); 

router.use(auth); 
router.get("/", catchAsync(getAllUsers)); // for now it can be available for users.
router.get("/currentUser", catchAsync(getUserWithToken)); 
router.get("/:id", catchAsync(getUserWithId)); 

export default router;  