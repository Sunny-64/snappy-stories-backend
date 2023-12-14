import express from "express";

// Custom imports
import { register } from "./../../controllers";
import { catchAsync } from "./../../utils";

const router = express.Router(); 

router.get("/", (req, res) => {
    res.send("Auth routes");
}); 

router.post("/register", catchAsync(register)); 

export default router; 