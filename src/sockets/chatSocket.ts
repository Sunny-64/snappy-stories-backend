import { Server, Socket } from 'socket.io'
import { Message } from './../models';

const chatSocket = (socket: Socket, io: Server) => {
    // socket.on("chat-socket", (data:string) => {
    //     console.log("Welcome to chat Socket, Data received is : {", data, "}");
    // }); 

    socket.on('join', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('message', async (data) => {
        const { conversationId, message, author } = data;

        // Save the message to the database
        const newMessage = new Message({ conversationId, message, author });
        await newMessage.save(); 
        // Send the message to the conversation room
        io.to(conversationId).emit('message', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
}

export default chatSocket;