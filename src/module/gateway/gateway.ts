import {
    Body,
    Logger,
    UseGuards,
} from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { AuthGuard } from "../../common";
import { ChatRepository, CompanyRepository } from "../../DB";

@WebSocketGateway({
    cors: { origin: "*" },
})
@UseGuards(AuthGuard)
export class RealTimeGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly chatRepository: ChatRepository,
    ) { }

    @WebSocketServer()
    private server: Server;

    private readonly logger = new Logger(RealTimeGateway.name);

    afterInit(server: Server) {
        this.logger.log("WebSocket initialized 🔭🔭");
    }
    private clientID: string;
    private usersMap = new Map<string, string>();
    handleConnection(client: Socket) {
        this.clientID = client.id;
        console.log(`Client connected: ${this.clientID}`);
        console.log(`Client connected: ${client.data.user}`);


    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${this.clientID}`);
        const user = client.data.user;

        if (user) {
            this.usersMap.delete(user.id);
            this.logger.log(
                `User ${user.id} disconnected from socket ${client.id}`,
            );
        }
        this.logger.log(`Users Map: ${JSON.stringify(Array.from(this.usersMap.entries()))}`);

    }

    @SubscribeMessage("startChat")
    async startChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: { receiverId: string, companyId: string },

    ) {
        console.log(`start chat called by client: ${this.clientID} ,client user id form token : ${client.data.user}`);
        const user = client.data.user;
        this.usersMap.set(user.id, client.id);
        this.logger.log(`Users Map: ${JSON.stringify(Array.from(this.usersMap.entries()))}`);

        //find company and check hr or not 
        const compantExist = await this.companyRepository.getOne({ _id: body.companyId, });
        if (!compantExist) {
            throw new WsException("company not found");
        }
        if (!compantExist.HRs.includes(user.id)) {
            throw new WsException("You are not allowed to start a chat for this company");
        }
        //create or get chat between user.id and body.receiverId
        let chat = await this.chatRepository.getOne({ senderId: user._id, receiverId: body.receiverId });
        if (!chat) {
            chat = await this.chatRepository.create({
                senderId: user._id,
                receiverId: new Types.ObjectId(body.receiverId),
                messages: [],
            });
        }
        const receiverSocketId = this.usersMap.get(body.receiverId);
        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit("chatStarted", {
                chatId: chat._id,
                senderId: user._id,
            });
        }
        return chat._id;
    }


    @SubscribeMessage("sendMessage")
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        body: { chatId: string; message: string },
    ) {
        //find chat by id 
        const chatExist = await this.chatRepository.getOne({ _id: body.chatId })
        if (!chatExist) {
            throw new WsException("chat not found");
        }
        //add message to list of messages
        chatExist.messages.push({
            senderId: client.data.user._id,
            message: body.message,
            createdAt: new Date(),
        });
        await chatExist.save();
        //emit to receiver if online ---- //TODO ::: notification 
        this.server.to(body.chatId).emit("newMessage", {
            senderId: client.data.user._id,
            message: body.message,
            createdAt: new Date(),
        });
        //response to sender done
        return { status: "Message sent successfully" };
    }

    @SubscribeMessage("getChatHistory")
    async getChatHistory(
        @ConnectedSocket() client: Socket,
        @MessageBody() Body: { chatId: string },) {
        console.log(Body.chatId)
        const chatExist = await this.chatRepository.getOne({ _id: Body.chatId }, {}, {
            populate: [
                {
                    path: 'senderId',
                    select: 'name email firstName lastName'
                },
                {
                    path: 'receiverId',
                    select: 'name email firstName lastName'
                },
                {
                    path: 'messages.senderId',
                    select: 'name email firstName lastName',
                },
            ]
        });
        if (!chatExist) {
            throw new WsException("chat not found");
        }
        return chatExist

    }
}
