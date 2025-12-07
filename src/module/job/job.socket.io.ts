import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class JobGateway {
  @WebSocketServer()
  server: Server;

  notifyHR(companyId: string, payload: any) {
    this.server.to(`company-${companyId}`).emit('job-application', payload);
  }
}