import { Request } from "express";
// export interface IUser {

// } // complete this once we have the user data..

export interface ICustomRequest extends Request {
    user?: any; // Replace 'any' with the actual type of your 'user' property if known
}
