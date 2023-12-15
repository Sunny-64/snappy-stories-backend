import express from "express";

// Custom imports
import { 
    register, 
    loginUsingEmailAndPassword,
    verifyEmail, 
    resendOtp, 
    resetPassword, 
    forgotPassword, 
    verifyOtp 
} from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth } from "./../../middlewares";

const router = express.Router(); 

router.get("/", (req, res) => {
    res.send("Auth routes");
}); 

router.post("/register", catchAsync(register)); 
router.post("/login", catchAsync(loginUsingEmailAndPassword));
router.post("/verify-email", auth ,catchAsync(verifyEmail));
router.post("/resend-otp", auth ,catchAsync(resendOtp)); 
router.post("/forgot-password", catchAsync(forgotPassword)); 
router.post("/reset-password/:userId", catchAsync(resetPassword)); 
router.post("/verify-otp/:userId", catchAsync(verifyOtp));

export default router; 