import { Socket } from 'socket.io'
import chatEvents from './../constants/chatEvents';


const mountJoinNewChatEvent = (socket: Socket) => {
    socket.on(chatEvents.JOIN, (conversationId) => {
        console.log("user joined the root"); 
        socket.join(conversationId);
    });
}

export {
    mountJoinNewChatEvent,
};