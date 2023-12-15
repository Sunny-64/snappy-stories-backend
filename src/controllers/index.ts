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
} from './user.controller'; 

export {
    getAllUsers,
    getUserWithId,
}