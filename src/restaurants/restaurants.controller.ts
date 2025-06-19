// src/restaurant/restaurant.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';  
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Post()
  @Roles('restaurant') 
  create(
    @Body() createDto: CreateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantService.create(createDto, user);
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Patch(':id')
  @Roles('restaurant')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantService.update(+id, updateDto, user);
  }

  @Delete(':id')
  @Roles('restaurant')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.restaurantService.remove(+id, user);
  }

  @Get()
  findAllPaginated(
    @Param('page') page: number = 1,
    @Param('limit') limit: number = 10,
  ) { 
    return this.restaurantService.findAllPaginated(page, limit);
  }


  @Get('/my')
  @Roles('restaurant')
  findMyRestaurants(@CurrentUser() user: User) {
    return this.restaurantService.findByOwner(user.id);
  }


}
