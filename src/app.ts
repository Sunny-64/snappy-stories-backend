import express from "express";
import cors from 'cors'

// Custom Imports
import { 
    errorHandler,
 } from './middlewares/'; 

 import {
    userRoutes, 
    authRoutes,
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

app.get("*", (req, res) => {
    res.status(404).json({
        success : false, 
        message : "not found"
    })
}); 

app.use(errorHandler)
export default app; 