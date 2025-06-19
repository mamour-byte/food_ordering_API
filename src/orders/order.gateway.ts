import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  // Permet au client de s'abonner à une commande
  @SubscribeMessage('joinOrderRoom')
  handleJoinOrderRoom(client: Socket, orderId: number) {
    client.join(`order-${orderId}`);
    client.emit('joinedOrderRoom', orderId);
  }

  // Permet d'émettre une mise à jour d'une commande
  sendOrderStatusUpdate(orderId: number, status: string) {
    this.server.to(`order-${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status,
    });
  }
}
