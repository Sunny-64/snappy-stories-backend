import { configDotenv } from "dotenv";
import {createServer} from 'http'; 
import mongoose from "mongoose";
import {Server} from 'socket.io'

// Custom Imports..
import app from "./app";

// Environment initialization
configDotenv();
const httpServer = createServer(app); 
const PORT = process.env.PORT || 3000; 

let io; 

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Connected to MongoDB"); 
    io = new Server(httpServer); 
    httpServer.listen(3000, () => {
        console.log(`SERVER RUNNING AT : http://localhost:${PORT}`)
    })
}).catch(err => console.log(err)); 

export {
    io,
}