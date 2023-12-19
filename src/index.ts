import dotenv from "dotenv";

// Custom Imports..
import {httpServer} from "./app";
import { connnectDB } from "./configs";

// Environment initialization
dotenv.config();

const PORT = process.env.PORT || 3000;

connnectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`SERVER RUNNING AT : http://localhost:${PORT}`)
    });     
}).catch(err => console.log(err));