import express from "express";
import cors from 'cors'
import { seed } from "./seed";

// Custom Imports
import { 
    errorHandler,
 } from './middlewares/'; 

 import {
    userRoutes, 
    authRoutes,
    messageRoutes,
} from './routes/v1'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : "*", 
})); 

app.get("/", (req, res) => {
    res.status(200).json({
        success : true, 
        message : "Welcome"
    });
})

app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/messages", messageRoutes);

app.get("*", (req, res) => {
    res.status(404).json({
        success : false, 
        message : "Route not found"
    })
}); 

seed(); 
app.use(errorHandler); 

export default app; 