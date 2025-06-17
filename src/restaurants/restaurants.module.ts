import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}
