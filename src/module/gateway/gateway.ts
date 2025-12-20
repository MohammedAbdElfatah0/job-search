import { UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthGuard } from "src/common";
import { socketIOAuthorization } from "src/common/utils/socket.io.authorization";



@UseGuards(AuthGuard)
@WebSocketGateway({ cors: { origin: "*", }, })
export class RealTimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    afterInit(server: Server) {
        console.log("webSocket intialized");
        //map here ?
    }
    
    handleDisconnect(client: Socket) {
        //when disconnected 
        const token = socketIOAuthorization(client);
        console.log(`client disconnected: ${client.id} time leave: ${token}`);
        //remove user id socket form memory map
        // throw new Error("Method not implemented.");
    }
    
    handleConnection(client: Socket) {
        //logic of map id and give id user 
        const token = socketIOAuthorization(client);
        console.log({ token });
        
        // throw new Error("Method not implemented.");
    }
    
    @SubscribeMessage("sayHi")
    sayHi(@MessageBody() message: any): string {
        console.log({ message })
        return `Hello, welcome`;
    }
}