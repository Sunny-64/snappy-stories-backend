import express from "express";

// Custom imports
import { register, loginUsingEmailAndPassword,verifyOtp, resendOtp } from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth } from "./../../middlewares";

const router = express.Router(); 

router.get("/", (req, res) => {
    res.send("Auth routes");
}); 

router.post("/register", catchAsync(register)); 
router.post("/login", catchAsync(loginUsingEmailAndPassword));
router.post("/verify-otp", auth ,catchAsync(verifyOtp));
router.post("/resend-otp", auth ,catchAsync(resendOtp))

export default router; 