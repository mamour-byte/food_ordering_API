import { Controller, Post, Get, Param, Patch, Delete, Body, Request, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/user.entity'; 



@UseGuards(JwtAuthGuard) // protège toutes les routes du contrôleur
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(@Body() dto: CreateMealDto, @CurrentUser() user: User) {
    return this.mealsService.create(dto, user);
  }


  @Get()
  findAll() {
    return this.mealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMealDto, @Request() req, @CurrentUser() user: User) {
    const restaurantId = req.user.restaurantId;
    return this.mealsService.update(+id, { ...dto, restaurantId }, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const restaurantId = req.user.restaurantId;
    return this.mealsService.remove(+id, restaurantId);
  }
}
