import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { Category } from 'src/categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Restaurant, Category])],
  providers: [MealsService],
  controllers: [MealsController],
})
export class MealsModule {}
