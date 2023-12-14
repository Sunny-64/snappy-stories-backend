
import { Server } from "socket.io";

// Custom imports
import chatSocket  from "./chatSocket";

const connectSocket = (httpServer:any) => {
    const io = new Server(httpServer, {
        cors : {
            origin : '*'
        }
    }); 
   
    io.on("connection", (socket) => {
        console.log("User connected...."); 
        chatSocket(socket); 
        socket.on("disconnect", () => {
            console.log("User disconnected!!!"); 
        })
    })
}

export default connectSocket; 