import express from 'express'

// Custom imports
import { createOrGetConversation, fetchConversationsOfUser } from './../../controllers';
import { auth, verifiedEmailRequired } from './../../middlewares';
import { catchAsync } from './../../utils';
const router = express.Router(); 

router.use(auth);
router.use(verifiedEmailRequired);  

router.get("/", catchAsync(fetchConversationsOfUser));
router.post("/:targetId", catchAsync(createOrGetConversation)); 

export default router; 