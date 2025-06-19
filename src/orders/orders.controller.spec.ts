import { Patch , Param , Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
  @UseGuards(JwtAuthGuard)
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

  @Post()
    async createOrder(
      @Body() createOrderDto: CreateOrderDto,
      @Request() req: { user: User },
    ): Promise<Order> {
      const user = req.user;
      return this.ordersService.createOrder(createOrderDto, user);
    }

    @Get()
    async getUserOrders(@Request() req: { user: User }): Promise<Order[]> {
      const user = req.user;
      return this.ordersService.getOrdersForUser(user);
    }

  @Patch(':id/status')
    async updateStatus(
      @Param('id') id: number,
      @Body() dto: UpdateOrderStatusDto,
      @Request() req: { user: User },
    ): Promise<Order> {
      return this.ordersService.updateOrderStatus(id, dto, req.user);
    }

    @Patch(':id/cancel')
      async cancelOrder(
        @Param('id') id: number,
        @Request() req: { user: User },
      ): Promise<Order> {
        return this.ordersService.cancelOrder(id, req.user);
      }

}
