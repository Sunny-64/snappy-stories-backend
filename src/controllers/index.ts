// Auth controller import/exports
import {
    register, 
    loginUsingEmailAndPassword, 
    verifyOtp, 
    resendOtp,
} from './auth.controller'; 

export {
    register,
    loginUsingEmailAndPassword,
    verifyOtp, 
    resendOtp,
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