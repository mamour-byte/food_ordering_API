import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Meal } from './meal.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private mealRepo: Repository<Meal>,

    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateMealDto, user: User): Promise<Meal> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: dto.restaurantId },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant introuvable');
    }

    if (restaurant.owner.id !== user.id) {
      throw new UnauthorizedException('Vous ne pouvez créer un repas que pour vos propres restaurants.');
    }

    let category: Category | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    }

    const meal = this.mealRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      isAvailable: dto.isAvailable ?? true,
      restaurant,
      category: category ?? undefined,
    });

    return this.mealRepo.save(meal);
  }

  async findAll(): Promise<Meal[]> {
    return this.mealRepo.find({ relations: ['restaurant', 'category'] });
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['restaurant', 'category'],
    });

    if (!meal) {
      throw new NotFoundException('Repas non trouvé');
    }

    return meal;
  }

  async update(id: number, dto: UpdateMealDto, user: User): Promise<Meal> {
    const meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner', 'category'],
    });

    if (!meal) {
      throw new NotFoundException('Repas non trouvé');
    }

    if (meal.restaurant.owner.id !== user.id) {
      throw new UnauthorizedException('Vous ne pouvez modifier que vos propres repas.');
    }

    if (dto.categoryId !== undefined) {
      const category = dto.categoryId
        ? await this.categoryRepo.findOneBy({ id: dto.categoryId })
        : null;
      meal.category = category ?? undefined;
    }

    Object.assign(meal, dto);
    return this.mealRepo.save(meal);
  }

  async remove(id: number, user: User): Promise<void> {
    const meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!meal) {
      throw new NotFoundException('Repas non trouvé');
    }

    if (meal.restaurant.owner.id !== user.id) {
      throw new UnauthorizedException('Vous ne pouvez supprimer que vos propres repas.');
    }

    await this.mealRepo.remove(meal);
  }
}
