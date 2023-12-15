import {Request, Response, NextFunction} from 'express'

// Custom imports
import { roles } from '../configs';
import { ICustomRequest } from 'types';

function requiredRole(role:string) {
    return (req:ICustomRequest, res:Response, next:NextFunction) => {
        const userRole = req.user.role;

        if (userRole === role) {
            next();
        } else {
            res.status(403).json({ message: 'Permission denied' });
        }
    };
}

export {
    requiredRole,
}