import express from 'express'

// Custom imports
import { createNewConversation } from './../../controllers';
import { auth } from './../../middlewares';
const router = express.Router(); 

router.get("/", (req, res) => {
    res.status(200).json({
        message : "test route",
    })
}); 

router.use(auth); 

router.post("/conversations", createNewConversation); 

export default router; 