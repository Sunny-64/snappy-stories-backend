import express from 'express'; 
import { auth } from './../../middlewares';
import { getAllMessagesOfAConversation, sendMessage } from './../../controllers';
import { catchAsync } from './../../utils';

const router = express.Router(); 

router.use(auth);
router.get("/:conversationId", catchAsync(getAllMessagesOfAConversation)); 
router.post("/:conversationId", catchAsync(sendMessage))

export default router; 