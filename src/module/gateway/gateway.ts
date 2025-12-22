import {
    Logger,
    UseGuards
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
    // Use a Map to track which User ID belongs to which Socket ID
    private usersMap = new Map<string, string>();

    afterInit(server: Server) {
        this.logger.log("WebSocket initialized 🔭🔭");
    }

    handleConnection(client: Socket) {
        // Ensure user data exists from AuthGuard/Middleware
        const user = client.data.user;
        if (user && user.id) {
            // Store string version of ID to avoid ObjectId comparison issues
            this.usersMap.set(user.id.toString(), client.id);
            this.logger.log(`User ${user.id} connected. Total Online: ${this.usersMap.size}`);
        }
    }
    //connect 
    @SubscribeMessage("connection")

    async connected(

        @ConnectedSocket() client: Socket,

    ) {

        const user = client.data.user;

        this.usersMap.set(user.id, client.id);

        this.logger.log(`User ${user.id} connected with socket ${client.id}`);
        this.logger.log({ user: this.usersMap });

        return "done connected";

    }

    handleDisconnect(client: Socket) {
        const user = client.data.user;
        if (user && user.id) {
            this.usersMap.delete(user.id.toString());
            this.logger.log(`User ${user.id} disconnected`);
        }
    }

    @SubscribeMessage("startChat")
    async startChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: { receiverId: string; companyId: string },
    ) {
        const user = client.data.user;
        const senderId = user.id.toString();
        const receiverId = body.receiverId.toString();

        // 1. Validate Company & HR Permission
        const company = await this.companyRepository.getOne({ _id: body.companyId });
        if (!company || !company.HRs.includes(senderId)) {
            throw new WsException("Unauthorized to start chat in this company");
        }

        // 2. Get or Create Chat
        let chat = await this.chatRepository.getOne({
            senderId,
            receiverId,
        });

        if (!chat) {
            chat = await this.chatRepository.create({
                senderId: user._id,
                receiverId: new Types.ObjectId(receiverId),
                messages: [],
            });
        }

        const roomId = chat._id.toString();

        // 3. Sender joins the room
        client.join(roomId);

        // 4. Critical: Find Receiver and make them join the room
        const receiverSocketId = this.usersMap.get(receiverId);
        if (receiverSocketId) {
            const receiverSocket = this.server.sockets.sockets.get(receiverSocketId);
            if (receiverSocket) {
                receiverSocket.join(roomId); // Receiver joins automatically

                // Notify receiver they have been added to a chat
                this.server.to(receiverSocketId).emit("chatStarted", {
                    chatId: roomId,
                    startedBy: user.firstName
                });
            }
        }

        return { chatId: roomId };
    }

    @SubscribeMessage("sendMessage")
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: { chatId: string; message: string },
    ) {
        const user = client.data.user;
        const chat = await this.chatRepository.getOne({ _id: body.chatId });

        if (!chat) throw new WsException("Chat not found");

        const message = {
            senderId: user._id,
            message: body.message,
            createdAt: new Date(),
        };

        chat.messages.push(message);
        await chat.save();

        // Emit to the entire room (includes sender and receiver)
        this.server.to(body.chatId).emit("newMessage", message);
        return { sent: true };
    }
}