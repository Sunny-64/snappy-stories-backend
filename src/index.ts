import { configDotenv } from "dotenv";
import {createServer} from 'http'; 
import mongoose from "mongoose";

// Custom Imports..
import app from "./app";
import connectSocket from "./sockets";

// Environment initialization
configDotenv();
const httpServer = createServer(app); 

const PORT = process.env.PORT || 3000; 

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Connected to MongoDB"); 
    httpServer.listen(3000, () => {
        console.log(`SERVER RUNNING AT : http://localhost:${PORT}`)
        connectSocket(httpServer);    
    })
}).catch(err => console.log(err)); 
