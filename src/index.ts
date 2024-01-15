import dotenv from "dotenv";

// Custom Imports..
import { httpServer } from "./app";
import { connnectDB } from "./configs";

// Environment initialization
dotenv.config();

const PORT = process.env.PORT || 3000;

let server : any; 

connnectDB().then(() => {
    server = httpServer.listen(PORT, () => {
        console.log(`SERVER RUNNING AT : http://localhost:${PORT}`)
    });
}).catch(err => console.log(err));

process.on('uncaughtException', (error:Error) => {
    console.log(error); 
    // restart the server or close it.
    server.close(() => {
        console.log("Server closed..."); 
        process.exit(1)
    }); 
}); 

process.on('unhandledRejection', (error:Error) => {
    console.log(error); 
    // restart the server or close it.
    server.close(() => {
        console.log("Server closed..."); 
        process.exit(1)
    }); 
}); 