import express from "express";

// Custom imports 
import { getAllUsers, getUserWithId, getUserWithToken, updateEmail, updateUserDetails } from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth, verifiedEmailRequired } from "./../../middlewares";
import { requiredRole } from "./../../middlewares";

const router = express.Router(); 

router.use(auth); 
router.use(verifiedEmailRequired); 

router.get("/", catchAsync(getAllUsers)); // for now it can be available for users.
router.get("/currentUser", catchAsync(getUserWithToken)); 
router.put("/", catchAsync(updateUserDetails))
router.patch("/email", catchAsync(updateEmail)); 
router.get("/:id", catchAsync(getUserWithId)); 

export default router;  