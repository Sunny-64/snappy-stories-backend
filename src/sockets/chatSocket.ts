import { Socket } from 'socket.io'
const chatSocket = (socket:Socket) => {
    socket.on("chat-socket", (data:string) => {
        console.log("Welcome to chat Socket, Data received is : {", data, "}");
    })
}

export default chatSocket;