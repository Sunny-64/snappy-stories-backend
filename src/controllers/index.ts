// Auth controller import/exports
import {
    register,
    loginUsingEmailAndPassword,
    verifyEmail,
    resendOtp,
    forgotPassword,
    verifyOtp,
    resetPassword,
} from './auth.controller';

export {
    register,
    loginUsingEmailAndPassword,
    verifyEmail,
    resendOtp,
    forgotPassword,
    verifyOtp,
    resetPassword,
}

// user controller import /exports
import {
    getAllUsers,
    getUserWithId,
    getUserWithToken
} from './user.controller';

export {
    getAllUsers,
    getUserWithId,
    getUserWithToken,
}

// Conversation controller
import {
    createOrGetConversation,
    fetchConversationsOfUser
} from './conversation.controller';

export {
    createOrGetConversation,
    fetchConversationsOfUser,
}

// Message controller

import {
    getAllMessagesOfAConversation, 
    sendMessage
} from './message.controller';

export {
    getAllMessagesOfAConversation,
    sendMessage,
}