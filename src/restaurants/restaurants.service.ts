// src/restaurant/restaurant.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(dto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      ...dto,
      owner, // on associe le restaurant au user connecté
    });

    return this.restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({ relations: ['owner'] });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant non trouvé');
    }

    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto, user: User): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (restaurant.owner.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres restaurants');
    }

    Object.assign(restaurant, dto);
    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: number, user: User): Promise<void> {
    const restaurant = await this.findOne(id);

    if (restaurant.owner.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres restaurants');
    }

    await this.restaurantRepository.remove(restaurant);
  }
}
