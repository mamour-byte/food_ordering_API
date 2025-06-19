import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , In } from 'typeorm';

import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

import { Meal } from 'src/meals/meal.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,

    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    client: User,
  ): Promise<Order> {
    const {
      restaurantId,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
      items,
    } = createOrderDto;

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant non trouvé');
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Aucun plat fourni');
    }

    const mealIds = items.map((item) => item.mealId);
    const meals = await this.mealRepository.find({
        where: { id: In(mealIds) },
        relations: ['restaurant'],
        });

    if (meals.length !== items.length) {
      throw new BadRequestException('Certains plats sont introuvables');
    }

    for (const meal of meals) {
      if (meal.restaurant.id !== restaurant.id) {
        throw new BadRequestException(
          `Le plat "${meal.name}" n'appartient pas au restaurant sélectionné`,
        );
      }
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const meal = meals.find((m) => m.id === item.mealId);
      if (!meal) continue;

      const orderItem = this.orderItemRepository.create({
        meal,
        quantity: item.quantity,
      });

      totalPrice += meal.price * item.quantity;
      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      client,
      restaurant,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
      totalPrice,
      items: orderItems,
      status: OrderStatus.PENDING,
    });

    return await this.orderRepository.save(order);
  }

  async getOrdersForUser(client: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { client },
      relations: ['items', 'items.meal', 'restaurant'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(
    orderId: number,
    dto: UpdateOrderStatusDto,
    user: User,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    if (order.restaurant.owner.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez pas modifier cette commande');
    }

    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    if (order.client.id !== user.id) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'annuler cette commande",
      );
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Cette commande ne peut plus être annulée');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
