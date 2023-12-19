import express from "express";
import cors from 'cors'
import { seed } from "./seed";
import {createServer} from 'http';
import { Server } from "socket.io";

// Custom Imports
import { initializeSocket } from "./sockets";
import { 
    errorHandler,
 } from './middlewares/'; 

 import {
    userRoutes, 
    authRoutes,
    conversationRoutes,
    messageRoutes,
} from './routes/v1'

const app = express();

const httpServer = createServer(app); 

const io = new Server(httpServer, {
    cors : {
        origin : "*"
    }
}); 

app.set("io", io); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : "*", 
})); 

initializeSocket(io);

app.get("/", (req, res) => {
    res.status(200).json({
        success : true, 
        message : "Welcome"
    });
})

app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/conversations", conversationRoutes);
app.use("/v1/messages", messageRoutes)

app.get("*", (req, res) => {
    res.status(404).json({
        success : false, 
        message : "Route not found"
    })
}); 

seed(); 
app.use(errorHandler); 

export {
    httpServer,
}