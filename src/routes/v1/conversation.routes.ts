import express from 'express'

// Custom imports
import { createOrGetConversation, fetchConversationsOfUser } from './../../controllers';
import { auth } from './../../middlewares';
import { catchAsync } from './../../utils';
const router = express.Router(); 

router.use(auth); 

router.get("/", catchAsync(fetchConversationsOfUser));
router.post("/:targetId", catchAsync(createOrGetConversation)); 

export default router; 