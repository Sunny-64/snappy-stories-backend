
import { Server, Socket } from "socket.io";
import jwt from 'jsonwebtoken';

// Custom imports
import { mountJoinNewChatEvent } from "./chatSocket";
import { ICustomRequest } from "./../types";
import { ApiError } from "./../utils";

const initializeSocket = (io: Server) => {
    io.on("connection", async (socket: Socket) => {
        try {
            const authToken: string = socket.handshake.auth.token || socket.handshake.headers.authorization;
            if (!authToken) throw new ApiError("Unauthorized Token", 401);

            const token = authToken.split(" ")[1];
            const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
            socket.join(decodedToken._id);
            socket.emit("connected", decodedToken._id); 

            // mount the listeners
            mountJoinNewChatEvent(socket);
            // Disconnect event
            socket.on("disconnect", () => {
                console.log("User disconnected!!!");
            })
        }
        catch (err) {
            console.log(err);
        }
    })
}

const emitSocketEvent = (req: ICustomRequest, roomId: string, event: string, payload: any) => {
    try {
        const io = req.app.get('io');
        io.to(roomId).emit(event, payload);
    } catch (err) {
        console.log(err);
    }
}

export {
    initializeSocket,
    emitSocketEvent,
}; 