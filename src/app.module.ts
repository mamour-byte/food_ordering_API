import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CategoriesModule } from './categories/categories.module';
import { MealsModule } from './meals/meals.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root', 
      password: 'Papou2212',
      database: 'food_ordering',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, 
    RestaurantsModule,
    CategoriesModule,
    MealsModule,
    OrdersModule,
    PaymentsModule,
    AuthModule,
  ],
})
export class AppModule {}
