import express from "express";
import cors from 'cors'

// Custom Imports
import { 
    errorHandler,
 } from './middlewares/'; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : "*", 
    optionsSuccessStatus : 204
})); 
// app.options("*", cors());

app.get("/", (req, res) => {
    res.send("hi");
})


app.use(errorHandler)
export default app; 