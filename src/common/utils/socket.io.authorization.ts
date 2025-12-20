import { Socket } from "socket.io";

export const socketIOAuthorization = (client: Socket) => {
    //todo fix here problem 
    const { authorization, refreshtoken } = client.handshake.headers ?? client.handshake.auth   ;//*front-end
    if (!authorization && !refreshtoken) {
        client.emit("exception", "invalid authorization or refreshToken");
    }
    return { authorization, refreshtoken };
};